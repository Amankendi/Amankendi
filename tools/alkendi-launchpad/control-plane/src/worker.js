/**
 * ALKENDI Launchpad control plane — Cloudflare Workers + isolated D1.
 * Fail-closed Cloudflare Access JWT, single owner, private GitHub repositories.
 * No production publication without two distinct owner actions and a pinned SHA.
 */
const SLUG = /^[a-z][a-z0-9-]{1,38}[a-z0-9]$/;
const OWNER = 'Amankendi';
const REPO_PREFIX = { internal: 'alkendi-', client: 'client-' };
const GITHUB_API = 'https://api.github.com';
const MAX_JSON = 20_000;
const MAX_EXPORT_FILES = 200;
const MAX_EXPORT_BYTES = 9_000_000;
const encoder = new TextEncoder();
let cachedKeys = { origin: '', until: 0, keys: null };

function responseJson(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'no-referrer',
    'X-Frame-Options': 'DENY',
  }});
}
function failure(message, status) { return responseJson({ ok: false, error: message }, status); }
function isConfigured(env) {
  const valid = x => typeof x === 'string' && !!x.trim() && !x.includes('REPLACE_');
  return !!(env.DB && env.ASSETS && valid(env.GH_OWNER) && env.GH_OWNER === OWNER &&
    valid(env.CF_ACCESS_AUD) && valid(env.CF_ACCESS_TEAM_DOMAIN) &&
    /^[a-z0-9-]+\.cloudflareaccess\.com$/.test(env.CF_ACCESS_TEAM_DOMAIN) &&
    valid(env.OWNER_EMAILS) && valid(env.GITHUB_TOKEN));
}
function decodeBase64Url(value) {
  const binary = atob(value.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - value.length % 4) % 4));
  return Uint8Array.from(binary, ch => ch.charCodeAt(0));
}
async function authenticate(request, env) {
  const jwt = request.headers.get('Cf-Access-Jwt-Assertion');
  if (!jwt) return null;
  const parts = jwt.split('.');
  if (parts.length !== 3) return null;
  let header, payload;
  try { header = JSON.parse(new TextDecoder().decode(decodeBase64Url(parts[0])));
    payload = JSON.parse(new TextDecoder().decode(decodeBase64Url(parts[1]))); }
  catch { return null; }
  if (header.alg !== 'RS256' || !header.kid || !payload.email || !Array.isArray(payload.aud)) return null;
  const now = Math.floor(Date.now() / 1000);
  const issuer = `https://${env.CF_ACCESS_TEAM_DOMAIN}`;
  if (payload.iss !== issuer || !payload.aud.includes(env.CF_ACCESS_AUD) ||
    !Number.isFinite(payload.exp) || payload.exp <= now ||
    (payload.nbf && payload.nbf > now + 30)) return null;
  const allow = env.OWNER_EMAILS.split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
  if (!allow.includes(payload.email.toLowerCase())) return null;
  try {
    if (cachedKeys.origin !== issuer || cachedKeys.until < Date.now()) {
      const res = await fetch(`${issuer}/cdn-cgi/access/certs`, { redirect: 'error' });
      if (!res.ok) return null;
      const data = await res.json();
      if (!Array.isArray(data.keys)) return null;
      cachedKeys = { origin: issuer, until: Date.now() + 5 * 60_000, keys: data.keys };
    }
    const jwk = cachedKeys.keys.find(k => k.kid === header.kid && k.kty === 'RSA');
    if (!jwk) return null;
    const key = await crypto.subtle.importKey('jwk', jwk, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify']);
    const verified = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, decodeBase64Url(parts[2]), encoder.encode(parts[0] + '.' + parts[1]));
    return verified ? { email: payload.email.toLowerCase() } : null;
  } catch { return null; }
}
function noCrossOriginMutation(request) {
  if (!['POST','PUT','PATCH','DELETE'].includes(request.method)) return true;
  const origin = request.headers.get('Origin');
  if (!origin || origin !== new URL(request.url).origin) return false;
  return request.headers.get('Content-Type')?.toLowerCase().startsWith('application/json') === true;
}
async function bodyJson(request) {
  const length = Number(request.headers.get('Content-Length') || 0);
  if (length > MAX_JSON) throw new ApiError(413, 'حجم الطلب أكبر من المسموح');
  const text = await request.text();
  if (text.length > MAX_JSON) throw new ApiError(413, 'حجم الطلب أكبر من المسموح');
  try { return JSON.parse(text); } catch { throw new ApiError(400, 'بيانات غير صالحة'); }
}
class ApiError extends Error { constructor(status, message) { super(message); this.status = status; } }
function validatedNew(data) {
  const name = typeof data.name === 'string' ? data.name.trim() : '';
  const slug = typeof data.slug === 'string' ? data.slug.trim() : '';
  if (!['internal','client'].includes(data.kind)) throw new ApiError(400, 'نوع المشروع غير صحيح');
  if (name.length < 2 || name.length > 90) throw new ApiError(400, 'اسم المشروع من 2 إلى 90 حرفًا');
  if (!SLUG.test(slug)) throw new ApiError(400, 'المعرّف يجب أن يكون 3-40 حرفًا إنجليزيًا صغيرًا أو رقمًا أو شرطة');
  const brief = typeof data.brief === 'string' ? data.brief.trim() : '';
  if (brief.length > 2400) throw new ApiError(400, 'وصف المشروع يتجاوز 2400 حرف');
  if (brief.includes('-----BEGIN PRIVATE KEY-----') || /github_pat_|ghp_[A-Za-z0-9]|sk-proj-/.test(brief)) throw new ApiError(400, 'لا تضع أسرار أو مفاتيح وصول في وصف المشروع');
  const repository = `${OWNER}/${REPO_PREFIX[data.kind]}${slug}`;
  return { name, slug, brief, kind: data.kind, repository, worker_name: `${REPO_PREFIX[data.kind]}${slug}` };
}
async function gh(env, path, method='GET', payload=undefined) {
  const res = await fetch(`${GITHUB_API}${path}`, {
    method,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${env.GITHUB_TOKEN}`,
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'ALKENDI-Launchpad/1.0',
      ...(payload === undefined ? {} : { 'Content-Type': 'application/json' })
    },
    ...(payload === undefined ? {} : { body: JSON.stringify(payload) }),
    redirect: 'error'
  });
  if (!res.ok) {
    // Do not return provider error bodies, which may contain privileged diagnostics.
    throw new ApiError(res.status === 404 ? 404 : 502, `GitHub: العملية لم تنجح (HTTP ${res.status})`);
  }
  if (res.status === 204) return null;
  return res.json();
}
function template(p) {
  const title = p.name.replace(/[&<>"']/g, s => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[s]));
  const manifest = {
    schema_version: 1, project_id: `${p.kind}-${p.slug}`, name:p.name, slug:p.slug,
    kind:p.kind, owner:OWNER, repository:p.repository, worker_name:p.worker_name,
    provider:'cloudflare-workers-static', state:'draft',
    deploy_policy:'pinned-sha-owner-approval-central-broker',
    data_policy:'isolated-no-cross-client-data'
  };
  const html = `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>${title}</title><style>:root{font-family:system-ui,-apple-system,sans-serif;color-scheme:dark}*{box-sizing:border-box}body{min-height:100vh;margin:0;display:grid;place-items:center;background:#0e1d27;color:#eaf1ee;padding:24px}main{width:min(760px,100%);border:1px solid #395950;padding:clamp(30px,8vw,70px);border-radius:28px;background:#172d37}small{color:#a0d4ae;letter-spacing:2px}h1{font-size:clamp(2.1rem,6vw,4.3rem);line-height:1.25}p{line-height:1.9;color:#b8c9c8}span{display:inline-block;border:1px solid #4d876d;color:#b4e4cc;padding:9px 16px;border-radius:100px}</style></head><body><main><small>ALKENDI LAB · PRIVATE DRAFT</small><h1>${title}</h1><p>هذه مساحة تأسيس آمنة للمشروع. استبدل هذه الواجهة بالتصميم المعتمد قبل طلب النشر.</p><span>نسخة تأسيسية — غير معتمدة للإطلاق</span></main></body></html>`;
  const deploy = `name: ALKENDI source check\non:\n  push:\n    branches: [main]\n  pull_request:\npermissions:\n  contents: read\njobs:\n  verify:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - run: |\n          python3 -m json.tool alkendi.project.json > /dev/null\n          python3 -m json.tool wrangler.jsonc > /dev/null\n          test -f public/index.html\n`;
  return {
    'alkendi.project.json': JSON.stringify(manifest,null,2)+'\n',
    'wrangler.jsonc': JSON.stringify({ name:p.worker_name,compatibility_date:'2026-10-20',assets:{directory:'./public'} },null,2)+'\n',
    '.gitignore': '.env\n.env.*\n!.env.example\nnode_modules/\n.wrangler/\n.vercel/\n*.pem\n*.key\n',
    'public/index.html': html+'\n',
    '.github/workflows/check.yml': deploy,
    'README.md': `# ${p.name}\n\n- PROJECT_ID: \`${p.kind}-${p.slug}\`\n- OWNER REPO: \`${p.repository}\` (private)\n- Runtime: isolated Cloudflare Worker \`${p.worker_name}\`\n- Publishing: ALKENDI Launchpad central, manually approved, commit pinned.\n\nNever publish the placeholder as a final customer product. No shared customer secrets, database, or authorization tenant.\n`,
    'docs/HANDOVER-CHECKLIST.md': handoverChecklist(p),
    'docs/01_PROJECT_MASTER_SPEC.md': `# ${p.name} — Project master brief\n\nPROJECT_ID: ${p.kind}-${p.slug}\n\n## Owner-provided design & product brief\n\n${p.brief || 'Awaiting the owner’s design brief. Do not invent approved identity, features, content or client claims.'}\n\n## Required execution\n- Turn the approved owner brief into a real design and implemented pages, not a screenshot.\n- Present preview, test mobile and desktop, verify working controls and accessibility.\n- No production deploy without owner acceptance.\n- Do not create or share client databases/auth/secrets without approval.\n`,
    'AGENTS.md': `# Agent instructions — ${p.name}\n\nRead docs/01_PROJECT_MASTER_SPEC.md first, then follow ALKENDI governance AMAN Product Build Standard, project isolation, and APLC. Use this repository as the only project source of truth. Produce PRs and actual test evidence; never auto-publish or modify another project's infrastructure. Owner review is required before release.\n`
  };
}
function handoverChecklist(p) {
  return `# ALKENDI Customer Handover — ${p.name}\n\nCustomer: [enter contracted party]\nSource: ${p.repository}\n\n- [ ] H01 Source code + reproducible build/release\n- [ ] H02 Hosting, DNS, infrastructure + rollback\n- [ ] H03 Database migrations + backup/restore, or N/A evidence\n- [ ] H04 Admin access + RBAC + ownership handover\n- [ ] H05 Operation and maintenance manuals\n- [ ] H06 Security, GDPR, privacy and safeguarding register\n- [ ] H07 Verified actual/estimated subscriptions and recurring costs\n- [ ] H08 Transferable assets, licensed rights and signed receipt\n- [ ] H09 Test results + UAT + deployment evidence\n- [ ] H10 Backup, independently tested restoration and recovery\n\nNever export secrets, private production data, or assume IP ownership transfers by source ZIP alone. Written acceptance is required.\n`;
}
async function seedRepository(env, p) {
  await gh(env, '/user/repos', 'POST', {name:p.repository.split('/')[1], private:true, auto_init:true, description:`ALKENDI Launchpad / ${p.kind} / ${p.name}`, has_issues:true});
  const info = await gh(env, `/repos/${p.repository}`);
  if (info.private !== true || info.owner?.login?.toLowerCase() !== OWNER.toLowerCase()) throw new ApiError(502, 'فشل التحقق من خصوصية وملكية المستودع');
  const branch = info.default_branch;
  if (!branch || !/^[a-z0-9/_-]+$/i.test(branch)) throw new ApiError(502, 'فرع المستودع غير متوقع');
  const ref = await gh(env, `/repos/${p.repository}/git/ref/heads/${encodeURIComponent(branch)}`);
  const baseSha = ref.object.sha;
  const commit = await gh(env, `/repos/${p.repository}/git/commits/${baseSha}`);
  const files = template(p);
  const tree = await gh(env, `/repos/${p.repository}/git/trees`, 'POST', {
    base_tree:commit.tree.sha,
    tree:Object.entries(files).map(([path,content])=>({path,mode:'100644',type:'blob',content}))
  });
  const next = await gh(env, `/repos/${p.repository}/git/commits`,'POST',{
    message:'Initial isolated Launchpad source (not deployed)',tree:tree.sha,parents:[baseSha]
  });
  await gh(env, `/repos/${p.repository}/git/refs/heads/${encodeURIComponent(branch)}`,'PATCH',{sha:next.sha,force:false});
  return { sha:next.sha, branch };
}
function query(env, sql, ...args) { return env.DB.prepare(sql).bind(...args); }
async function audit(env, id, email, action, result, details={}) {
  try { await query(env,'INSERT INTO audit_events (id,project_id,actor_email,action,result,details) VALUES (?,?,?,?,?,?)',crypto.randomUUID(),id,email,action,result,JSON.stringify(details)).run(); }
  catch (e) { console.error('audit failed',String(e)); }
}
async function projectById(env,id) {
  const row = await query(env, 'SELECT * FROM projects WHERE id=?',id).first();
  if (!row) throw new ApiError(404,'المشروع غير موجود');
  return row;
}
async function headSha(env,p) {
  const info = await gh(env,`/repos/${p.repository}`);
  if (info.private !== true || info.owner?.login?.toLowerCase() !== OWNER.toLowerCase()) throw new ApiError(409,'المستودع لم يعد خاصًا أو خرج من الحساب المعتمد');
  const ref = await gh(env,`/repos/${p.repository}/git/ref/heads/${encodeURIComponent(info.default_branch)}`);
  return { sha:ref.object.sha, branch:info.default_branch };
}
async function createProject(request, env, user) {
  const data = await bodyJson(request);
  if (data.confirm !== 'CREATE') throw new ApiError(400,'تأكيد الإنشاء غير مكتمل');
  const p = validatedNew(data);
  const found = await query(env,'SELECT id FROM projects WHERE repository=?',p.repository).first();
  if (found) throw new ApiError(409,'هذا المشروع مسجّل مسبقًا');
  // Persistent intent comes before the external side effect.
  const id = crypto.randomUUID();
  await query(env,'INSERT INTO projects (id,kind,name,slug,repository,worker_name,status) VALUES (?,?,?,?,?,?,?)',id,p.kind,p.name,p.slug,p.repository,p.worker_name,'provisioning').run();
  await audit(env,id,user.email,'PROJECT_CREATE','START',{repository:p.repository});
  try {
    const seeded = await seedRepository(env,p);
    await query(env,"UPDATE projects SET status='ready', error_message=NULL,updated_at=datetime('now') WHERE id=?",id).run();
    await audit(env,id,user.email,'PROJECT_CREATE','SUCCESS',{sha:seeded.sha,branch:seeded.branch});
    return responseJson({ok:true,project:await projectById(env,id),created_sha:seeded.sha},201);
  } catch(e) {
    await query(env,'UPDATE projects SET status=?, error_message=?,updated_at=datetime(\'now\') WHERE id=?','error','Repository provisioning incomplete; inspect private GitHub repository before retry',id).run();
    await audit(env,id,user.email,'PROJECT_CREATE','FAILED',{message:'Provisioning failed; manual reconciliation required'});
    throw e;
  }
}
async function approveProject(request, env, user, id) {
  const p=await projectById(env,id);
  if (!['ready','approved','dispatched'].includes(p.status)) throw new ApiError(409,'حالة المشروع لا تسمح بالاعتماد');
  const body=await bodyJson(request);
  if (body.confirm !== `APPROVE ${p.slug}`) throw new ApiError(400,'اكتب تأكيد الاعتماد الصحيح');
  const head=await headSha(env,p);
  await query(env,"UPDATE projects SET status='approved', approved_sha=?,updated_at=datetime('now') WHERE id=?",head.sha,p.id).run();
  await audit(env,p.id,user.email,'RELEASE_APPROVED','SUCCESS',{sha:head.sha});
  return responseJson({ok:true,approved_sha:head.sha});
}
async function dispatchProject(request, env,user,id) {
  const p=await projectById(env,id);
  if (p.status!=='approved' || !p.approved_sha) throw new ApiError(409,'اعتمد نسخة محددة من المشروع أولًا');
  const body=await bodyJson(request);
  if (body.confirm !== `DEPLOY ${p.slug}`) throw new ApiError(400,'تأكيد النشر غير صحيح');
  const head=await headSha(env,p);
  if (head.sha !== p.approved_sha) throw new ApiError(409,'تغيّر الكود بعد الاعتماد؛ يلزم اعتماد النسخة الجديدة');
  // Central broker is a shared engineering utility, NEVER customer data/runtime.
  await gh(env,`/repos/${OWNER}/Amankendi/actions/workflows/launchpad-deploy.yml/dispatches`,'POST',{
    ref:'main',inputs:{ target_repository:p.repository,target_sha:head.sha,target_worker:p.worker_name,kind:p.kind,confirmation:'DEPLOY-PINNED' }
  });
  await query(env,"UPDATE projects SET status='dispatched',updated_at=datetime('now') WHERE id=?",p.id).run();
  await audit(env,p.id,user.email,'DEPLOY_DISPATCHED','REQUESTED',{sha:head.sha});
  return responseJson({ok:true,state:'DISPATCH_REQUESTED_NOT_VERIFIED',sha:head.sha});
}
function fileExcluded(path, mode) {
  if (mode === '120000') return true;
  const parts=path.split('/');
  if (parts.some(p=>['node_modules','.git','.next','.wrangler','.vercel','dist','build','coverage','.venv','__pycache__'].includes(p))) return true;
  return parts.some(p=>/^\.env($|\.)/.test(p)) || /(^|\/)(\.npmrc|\.pypirc|id_rsa|id_ed25519)$/.test(path) || /\.(pem|key|p12|pfx)$/i.test(path);
}
function toBytes(base64) {
  const source=atob(base64.replace(/\s/g,''));
  return Uint8Array.from(source,ch=>ch.charCodeAt(0));
}
function secretDetected(bytes) {
  if (bytes.some(n => n === 0)) return true;
  const s=new TextDecoder('utf-8',{fatal:false}).decode(bytes);
  return /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|github_pat_|ghp_[A-Za-z0-9]|gho_[A-Za-z0-9]|sk-proj-|sb_secret_|AKIA[0-9A-Z]{16}/.test(s);
}
// ZIP "store" encoder; no dependency/runtime upload, Unicode paths via UTF-8 flag.
function crc32(bytes) { let crc=0xffffffff;for(const b of bytes){crc^=b;for(let j=0;j<8;j++)crc=(crc>>>1)^(0xedb88320 & -(crc&1));}return (crc^0xffffffff)>>>0; }
function makeZip(files) {
  const local=[], central=[];let offset=0;
  function uint16(v){return [v&255,(v>>>8)&255];}
  function uint32(v){return [v&255,(v>>>8)&255,(v>>>16)&255,(v>>>24)&255];}
  for(const [name,value] of files) {
    const filename=encoder.encode(name),bytes=value instanceof Uint8Array?value:encoder.encode(value);
    if(filename.length>65535)throw new ApiError(413,'اسم ملف طويل جدًا');
    const crc=crc32(bytes),size=bytes.length;
    const a=Uint8Array.from([...uint32(0x04034b50),...uint16(20),...uint16(0x800),...uint16(0),...uint16(0),...uint16(0),...uint32(crc),...uint32(size),...uint32(size),...uint16(filename.length),...uint16(0)]);
    local.push(a,filename,bytes);
    central.push(Uint8Array.from([...uint32(0x02014b50),...uint16(20),...uint16(20),...uint16(0x800),...uint16(0),...uint16(0),...uint16(0),...uint32(crc),...uint32(size),...uint32(size),...uint16(filename.length),...uint16(0),...uint16(0),...uint16(0),...uint16(0),...uint32(0),...uint32(offset)]),filename);
    offset+=a.length+filename.length+bytes.length;
  }
  const cdSize=central.reduce((sum,arr)=>sum+arr.length,0),cdOffset=offset;
  const end=Uint8Array.from([...uint32(0x06054b50),...uint16(0),...uint16(0),...uint16(files.length),...uint16(files.length),...uint32(cdSize),...uint32(cdOffset),...uint16(0)]);
  const chunks=[...local,...central,end];const result=new Uint8Array(chunks.reduce((s,b)=>s+b.length,0));let ptr=0;
  for(const chunk of chunks){result.set(chunk,ptr);ptr+=chunk.length;}
  return result;
}
async function exportProject(request,env,user,id) {
  const p=await projectById(env,id);
  const body=await bodyJson(request);
  if(body.confirm!==`EXPORT ${p.slug}`) throw new ApiError(400,'تأكيد التصدير غير صحيح');
  const head=await headSha(env,p);
  const tree=await gh(env,`/repos/${p.repository}/git/trees/${head.sha}?recursive=1`);
  if(tree.truncated || !Array.isArray(tree.tree)) throw new ApiError(413,'المشروع كبير جدًا للتصدير بهذه الطريقة');
  const selected=tree.tree.filter(f=>f.type==='blob'&&!fileExcluded(f.path,f.mode));
  if(selected.length>MAX_EXPORT_FILES || selected.reduce((s,f)=>s+(f.size||0),0)>MAX_EXPORT_BYTES) throw new ApiError(413,'حجم المشروع يتجاوز حد الحزمة الآمنة');
  const files=[];
  for(const f of selected) {
    if(f.size>1_500_000) throw new ApiError(413,'ملف مفرد كبير جدًا؛ يلزم تسليم آمن منفصل');
    const blob=await gh(env,`/repos/${p.repository}/git/blobs/${f.sha}`);
    if(blob.encoding!=='base64')throw new ApiError(502,'صيغة GitHub غير مدعومة');
    const bytes=toBytes(blob.content);
    if(secretDetected(bytes))throw new ApiError(409,`فشل فحص البيانات الحساسة في الملف ${f.path}`);
    files.push([`${p.slug}/${f.path}`,bytes]);
  }
  files.push([`${p.slug}/HANDOVER-MANIFEST.json`,JSON.stringify({format:'ALKENDI-LAUNCHPAD-HANDOVER-1',project_id:`${p.kind}-${p.slug}`,repository:p.repository,source_sha:head.sha,files:selected.length,excluded:'environment files, private keys, build dependencies, symlinks',not_transferred:['domain','database','hosting','private data','secrets','ownership and legal rights'],signed_acceptance_required:true},null,2)]);
  const zip=makeZip(files);
  await audit(env,p.id,user.email,'SOURCE_EXPORTED','SUCCESS',{sha:head.sha,files:files.length});
  return new Response(zip,{headers:{'Content-Type':'application/zip','Content-Disposition':`attachment; filename="${p.slug}-handover.zip"`,'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
}
async function routeApi(request,env,user,url) {
  const path=url.pathname;
  if(request.method==='GET'&&path==='/api/session') {
    const total=await query(env,'SELECT kind,COUNT(*) n FROM projects GROUP BY kind').all();
    return responseJson({ok:true,user:user.email,projects:total.results,version:'1.0.0-beta.1',hosting:'Cloudflare Workers',repo_owner:OWNER});
  }
  if(request.method==='GET'&&path==='/api/projects') {
    const data=await query(env,'SELECT * FROM projects ORDER BY created_at DESC LIMIT 150').all();
    return responseJson({ok:true,projects:data.results});
  }
  if(request.method==='POST'&&path==='/api/projects')return createProject(request,env,user);
  const match=path.match(/^\/api\/projects\/([a-f0-9-]{36})(?:\/(approve|deploy|export|audit))?$/);
  if(match) {
    const [,id,action]=match;
    if(request.method==='GET'&&!action)return responseJson({ok:true,project:await projectById(env,id)});
    if(request.method==='GET'&&action==='audit') {
      await projectById(env,id);
      const events=await query(env,'SELECT actor_email,action,result,details,created_at FROM audit_events WHERE project_id=? ORDER BY created_at DESC LIMIT 30',id).all();
      return responseJson({ok:true,events:events.results});
    }
    if(request.method==='POST'&&action==='approve')return approveProject(request,env,user,id);
    if(request.method==='POST'&&action==='deploy')return dispatchProject(request,env,user,id);
    if(request.method==='POST'&&action==='export')return exportProject(request,env,user,id);
  }
  return failure('عنوان API غير موجود',404);
}
export default {
  async fetch(request,env) {
    const url=new URL(request.url);
    if(!isConfigured(env))return url.pathname.startsWith('/api/')?failure('Launchpad غير مُهيّأ أو الاتصال غير مكتمل',503):new Response('Control plane not configured',{status:503});
    const user=await authenticate(request,env);
    if(!user)return url.pathname.startsWith('/api/')?failure('الدخول مقصور على المالك المعتمد',401):new Response('Unauthorized',{status:401,headers:{'Cache-Control':'no-store'}});
    if(!noCrossOriginMutation(request))return failure('فشل فحص حماية الطلب',403);
    try {
      if(url.pathname.startsWith('/api/'))return await routeApi(request,env,user,url);
      if(request.method!=='GET'&&request.method!=='HEAD')return failure('الطريقة غير مسموحة',405);
      const asset=await env.ASSETS.fetch(request);
      const headers=new Headers(asset.headers);
      headers.set('Cache-Control','no-store');headers.set('X-Frame-Options','DENY');
      headers.set('Referrer-Policy','no-referrer');headers.set('X-Content-Type-Options','nosniff');
      headers.set('Content-Security-Policy',"default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; object-src 'none'; frame-ancestors 'none'; base-uri 'self'");
      return new Response(asset.body,{status:asset.status,headers});
    } catch(error) {
      if(error instanceof ApiError)return failure(error.message,error.status);
      console.error('launchpad request failed',String(error));
      return failure('تعذر إكمال العملية، راجع سجل النظام',500);
    }
  }
};
export const _test = { validatedNew,template,crc32,makeZip,fileExcluded,secretDetected,decodeBase64Url,authenticate,isConfigured,noCrossOriginMutation };
