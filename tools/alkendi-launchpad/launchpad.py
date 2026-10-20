#!/usr/bin/env python3
"""ALKENDI Launchpad v0.1: isolated GitHub-first static project lifecycle.

No network call is made by new, doctor, or export. Any remote mutation requires
an explicit --approve on the relevant command.
"""
import argparse
import hashlib
import json
import os
from pathlib import Path
import re
import shutil
import subprocess
import sys
import zipfile

OWNER = 'Amankendi'
SLUG = re.compile(r'^[a-z][a-z0-9-]{1,38}[a-z0-9]$')
SKIP_DIRS = {'.git', '.next', '.wrangler', '.vercel', '.venv', 'node_modules',
             '__pycache__', 'dist', 'build', 'coverage', '.turbo', '.pytest_cache'}
SKIP_FILES = {'.DS_Store', '.npmrc', '.pypirc', 'id_rsa', 'id_ed25519'}
SECRET_MARKERS = [b'-----BEGIN PRIVATE KEY-----', b'ghp_', b'gho_', b'github_pat_',
                  b'sk-proj-', b'sb_secret_', b'AKIA']


def die(message):
    raise ValueError(message)


def slug_checked(value):
    if not SLUG.fullmatch(value):
        die('Slug must be 3-40 chars, lowercase a-z/0-9/hyphen, starting with a letter and ending alphanumeric.')
    return value


def manifest(root):
    fp = root / 'alkendi.project.json'
    if not fp.is_file():
        die('Missing alkendi.project.json; select an ALKENDI Launchpad project.')
    data = json.loads(fp.read_text(encoding='utf-8'))
    if data.get('schema_version') != 1 or data.get('owner') != OWNER:
        die('Unsupported or foreign project manifest.')
    slug_checked(data.get('slug', ''))
    if data.get('kind') not in ('internal', 'client'):
        die('Invalid project kind.')
    if data.get('provider') != 'cloudflare-workers-static':
        die('This v0.1 release only supports Cloudflare Workers static sites.')
    return data


def write(root, path, content):
    dest = root / path
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_text(content, encoding='utf-8')


def new(args):
    slug = slug_checked(args.slug)
    base = Path(args.workspace).expanduser().resolve()
    root = base / slug
    if root.exists():
        die(f'Project directory already exists: {root}. Nothing overwritten.')
    if not base.exists() or not base.is_dir():
        die(f'Workspace directory does not exist: {base}')
    repo = f'{"client" if args.kind == "client" else "alkendi"}-{slug}'
    root.mkdir()
    data = {
        'schema_version': 1, 'project_id': f'{args.kind}-{slug}',
        'name': args.name.strip(), 'slug': slug, 'kind': args.kind,
        'owner': OWNER, 'repository': f'{OWNER}/{repo}',
        'provider': 'cloudflare-workers-static',
        'worker_name': f'{"client" if args.kind == "client" else "alkendi"}-{slug}',
        'state': 'draft', 'deploy_policy': 'manual-owner-approval',
        'data_policy': 'isolated-no-customer-data-in-launchpad',
    }
    if not data['name']:
        die('Nonempty --name is required.')
    write(root, 'alkendi.project.json', json.dumps(data, ensure_ascii=False, indent=2) + '\n')
    config = {
        'name': data['worker_name'], 'compatibility_date': '2026-10-20',
        'assets': {'directory': './public'},
    }
    write(root, 'wrangler.jsonc', json.dumps(config, indent=2) + '\n')
    write(root, '.gitignore', '.env\n.env.*\n!.env.example\nnode_modules/\n.wrangler/\n.vercel/\n.next/\ndist/\nbuild/\ncoverage/\n*.pem\n')
    title = data['name'].replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;').replace('"', '&quot;')
    write(root, 'public/index.html', f'''<!doctype html>
<html lang="ar" dir="rtl"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>{title}</title><style>
:root{{color-scheme:dark;font-family:system-ui,-apple-system,"Segoe UI",sans-serif}}
*{{box-sizing:border-box}}body{{margin:0;min-height:100vh;display:grid;place-items:center;background:#0f1b25;color:#e8eef2;padding:24px}}
main{{width:min(760px,100%);padding:clamp(28px,7vw,60px);border:1px solid #284451;border-radius:26px;background:#14242f;box-shadow:0 20px 70px #06111888}}
small{{letter-spacing:.1em;color:#97c9b0}}h1{{font-size:clamp(2rem,5vw,3.4rem);line-height:1.3;margin:20px 0}}
p{{line-height:1.9;color:#c2d2dc}}.pill{{display:inline-block;border:1px solid #558d75;border-radius:40px;padding:8px 15px;color:#b2e8c7}}
</style></head><body><main><small>ALKENDI LAB • PROJECT PREVIEW</small><h1>{title}</h1>
<p>مساحة مشروع جاهزة لتلقي تصميمك ومحتواك الأصلي. هذه صفحة تأسيس وليست موقعًا نهائيًا أو نسخة منشورة.</p>
<span class="pill">مسودة قيد التطوير — لا تنشر قبل الموافقة</span></main></body></html>
''')
    write(root, '.github/workflows/check.yml', '''name: Validate source
on:
  pull_request:
  push:
    branches: [main]
permissions:
  contents: read
jobs:
  source-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Validate manifest and Worker config
        run: |
          python3 -m json.tool alkendi.project.json > /dev/null
          python3 -m json.tool wrangler.jsonc > /dev/null
          test -f public/index.html
''')
    write(root, '.github/workflows/deploy-cloudflare.yml', '''name: Production deploy — owner-triggered ONLY
on:
  workflow_dispatch:
    inputs:
      confirmation:
        description: 'Type DEPLOY to authorize production release'
        required: true
        type: string
permissions:
  contents: read
concurrency:
  group: cloudflare-production
  cancel-in-progress: false
jobs:
  publish:
    if: github.event.inputs.confirmation == 'DEPLOY'
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
      - name: Verify required bindings
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          CLOUDFLARE_ACCOUNT_ID: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
        run: |
          test -n "$CLOUDFLARE_API_TOKEN"
          test -n "$CLOUDFLARE_ACCOUNT_ID"
      - name: Deploy Cloudflare Worker with static assets
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          CLOUDFLARE_ACCOUNT_ID: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
        run: npx --yes wrangler@4 deploy --config wrangler.jsonc
''')
    write(root, 'README.md', f'''# {data['name']}\n\nProject ID: `{data['project_id']}`  \nGitHub source of truth: `{data['repository']}` (create as PRIVATE)  \nHosting: Cloudflare Workers static assets — isolated Worker `{data['worker_name']}`.\n\n## Lifecycle\n1. Replace `public/` placeholder with reviewed product design/content.\n2. Run `python path/to/launchpad.py doctor .` from the Launchpad tool.\n3. Create a **private** GitHub repository using `launchpad.py github . --approve` (requires preauthorized `gh` and Git).\n4. Set repository secrets `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` (project-scoped access preferred).\n5. Review CI and owner acceptance; use GitHub Actions → `Production deploy — owner-triggered ONLY`, type `DEPLOY`.\n6. Verify the LIVE endpoint, then add the domain separately if approved; do not alter unrelated DNS/mail.\n7. For a client, export using `launchpad.py export . --out /safe/path`, then separately agree on source ownership, infra, domain, services and data transfer.\n\n**No automatic publication, no database/auth/payment provisioned, no transfer of ownership by ZIP export.**\n''')
    print(json.dumps({'created': str(root), 'repository_intended': data['repository'], 'status': 'LOCAL_DRAFT_NOT_PUBLISHED'}, ensure_ascii=False))


def scan(root):
    data = manifest(root)
    if not (root / 'public' / 'index.html').is_file():
        die('Missing static site entrypoint public/index.html.')
    config = json.loads((root / 'wrangler.jsonc').read_text(encoding='utf-8'))
    if config.get('name') != data['worker_name'] or config.get('assets', {}).get('directory') != './public':
        die('Wrangler config does not match project and asset folder.')
    included = []
    for file in sorted(root.rglob('*')):
        rel = file.relative_to(root)
        if any(part in SKIP_DIRS for part in rel.parts):
            continue
        if any(part.startswith('.env') for part in rel.parts):
            continue
        if file.name in SKIP_FILES or file.suffix in ('.pem', '.key', '.p12', '.pfx'):
            continue
        if file.is_symlink():
            die(f'Unsafe symlink detected: {rel}')
        if not file.is_file():
            continue
        if file.stat().st_size <= 2_000_000:
            contents = file.read_bytes()
            if any(marker in contents for marker in SECRET_MARKERS):
                die(f'Potential credential in {rel}; review before export.')
        included.append((file, str(rel)))
    return data, included


def doctor(args):
    root = Path(args.project).expanduser().resolve()
    data, files = scan(root)
    print(json.dumps({'status': 'PASS_SOURCE_ONLY', 'project_id': data['project_id'], 'source_files': len(files), 'repo': data['repository'], 'deployment_verified': False}, ensure_ascii=False))


def export(args):
    root = Path(args.project).expanduser().resolve()
    data, files = scan(root)
    destination = Path(args.out).expanduser().resolve()
    destination.mkdir(parents=True, exist_ok=True)
    target = destination / (data['slug'] + '-source-handover.zip')
    if target.exists() and not args.replace:
        die(f'Export already exists: {target}; use --replace to overwrite deliberately.')
    if destination == root or root in destination.parents:
        die('Export destination must be outside the project to avoid recursive inclusion.')
    tmp = target.with_suffix('.tmp')
    try:
        with zipfile.ZipFile(tmp, 'w', compression=zipfile.ZIP_DEFLATED) as z:
            for file, rel in files:
                z.write(file, arcname=f"{data['slug']}/{rel}")
            handoff = {
                'format': 'ALKENDI-LAUNCHPAD-HANDOFF-V1', 'project_id': data['project_id'],
                'source_repository': data['repository'], 'included_source_files': len(files),
                'excluded': 'git history, environment files, dependencies, local build and private keys',
                'not_transferred': ['github repository ownership', 'hosting account', 'domain/DNS', 'database', 'secrets', 'customer data', 'license/IP rights'],
                'next': 'Separate owner-approved handover agreement and infrastructure/data transfer checklist required.',
            }
            z.writestr(f"{data['slug']}/HANDOVER-MANIFEST.json", json.dumps(handoff, indent=2))
        tmp.replace(target)
    finally:
        tmp.unlink(missing_ok=True)
    checksum = hashlib.sha256(target.read_bytes()).hexdigest()
    (destination / (target.name + '.sha256')).write_text(f'{checksum}  {target.name}\n', encoding='utf-8')
    print(json.dumps({'status': 'SOURCE_PACKAGE_CREATED', 'zip': str(target), 'sha256': checksum, 'files': len(files)}, ensure_ascii=False))


def command(argv, cwd):
    result = subprocess.run(argv, cwd=cwd, check=False, text=True, capture_output=True)
    if result.returncode:
        die(f'{argv[0]} {argv[1]} failed: {result.stderr.strip()[:600]}')
    return result.stdout.strip()


def github(args):
    root = Path(args.project).expanduser().resolve()
    data, _ = scan(root)
    if not args.approve:
        print(f'DRY RUN — Would create PRIVATE {data["repository"]} and push project files. Rerun with --approve.'); return
    for cmd in ('gh', 'git'):
        if not shutil.which(cmd):
            die(f'{cmd} not installed. Install and authenticate once, then retry.')
    command(['gh', 'auth', 'status'], root)
    if (root / '.git').exists():
        die('Local Git repository already initialized; inspect remote manually, no automatic overwrites.')
    # Always create independently; abort before any remote mutation if local commit fails.
    command(['git', 'init', '-b', 'main'], root)
    command(['git', 'add', '.'], root)
    command(['git', 'commit', '-m', 'Initial isolated ALKENDI Launchpad project'], root)
    command(['gh', 'repo', 'create', data['repository'], '--private', '--source', '.', '--remote', 'origin', '--push'], root)
    print(f'REPOSITORY_CREATED {data["repository"]} (PRIVATE). Not deployed.')


def deploy(args):
    root = Path(args.project).expanduser().resolve()
    data, _ = scan(root)
    if not args.approve:
        print(f'DRY RUN — Manual GitHub workflow dispatch for {data["repository"]}. Require --approve to dispatch; not an instant deployment guarantee.'); return
    if not shutil.which('gh'):
        die('gh not installed.')
    command(['gh','auth','status'], root)
    print(command(['gh', 'workflow', 'run', 'deploy-cloudflare.yml', '--repo', data['repository'], '--ref', 'main', '-f', 'confirmation=DEPLOY'], root))
    print('DISPATCH_REQUESTED: Check GitHub Actions logs for PASS/FAIL and separately test the live URL.')


def main(argv=None):
    parser = argparse.ArgumentParser(description='ALKENDI Launchpad v0.1 — project factory, manual-gated publishing and source handover')
    sub = parser.add_subparsers(dest='operation', required=True)
    p = sub.add_parser('new', help='Create isolated local static Worker project')
    p.add_argument('--name', required=True); p.add_argument('--slug', required=True)
    p.add_argument('--kind', required=True, choices=['internal', 'client']); p.add_argument('--workspace', default='.')
    p.set_defaults(func=new)
    p = sub.add_parser('doctor', help='Verify source-only checks'); p.add_argument('project'); p.set_defaults(func=doctor)
    p = sub.add_parser('export', help='Produce safe source ZIP + checksum; NOT a legal or runtime transfer')
    p.add_argument('project'); p.add_argument('--out', required=True); p.add_argument('--replace', action='store_true'); p.set_defaults(func=export)
    p = sub.add_parser('github', help='Create private repo with gh; explicit approval required')
    p.add_argument('project'); p.add_argument('--approve', action='store_true'); p.set_defaults(func=github)
    p = sub.add_parser('deploy', help='Dispatch owner-triggered GitHub deployment; explicit approval required')
    p.add_argument('project'); p.add_argument('--approve', action='store_true'); p.set_defaults(func=deploy)
    args = parser.parse_args(argv)
    try:
        args.func(args)
    except (ValueError, OSError, json.JSONDecodeError) as exc:
        parser.exit(2, f'BLOCKED: {exc}\n')

if __name__ == '__main__':
    main()
