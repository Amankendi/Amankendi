# ALKENDI Cloudflare + StackOps read-only inventory — 2026-10-23

**WORK_ID:** ALKENDI-CF-INVENTORY-20261023  
**PROJECT_ID:** alkendi-governance (cross-project audit only)  
**TARGET_REPOSITORY:** `Amankendi/Amankendi` (audit documents only)  
**Status:** PARTIAL VERIFIED / CLOUDflare ACCOUNT ACCESS BLOCKED  
**Scope:** Inventory; locate StackOps source; compare published endpoints against LAB catalogue; permissions, secrets **names only**, and usage-budget review.  
**Explicitly out of scope:** DNS/NS, Zoho mail, credentials, Workers/Pages deployments, service disable/delete, database migrations, payments, plan changes, or production source edits.

## Evidence levels

- **PUBLIC_LIVE:** public endpoint was fetched on 2026-10-23; confirms reachable visible page, not backend integrity.
- **SOURCE_DECLARED:** GitHub config/registry lists a resource; does **not** prove Cloudflare currently has that resource active.
- **OWNER_SCREENSHOT:** user showed Cloudflare Workers Paid checkout/purchase-complete screen at $5/month; no live billing dashboard access obtained.
- **UNVERIFIED:** account list, binding, secret inventory, usage totals, exact current version of the deployment, or source repository not yet accessible.

## 1. Cloudflare assets — observed vs declared

| Resource / hostname | Evidence | Identity / expected owner | Live configuration state | Decision |
| --- | --- | --- | --- | --- |
| `royal-mud-284d.alkendi.workers.dev` | PUBLIC_LIVE | ALKENDI StackOps pilot V0.1, marketed as LAB-managed product | Public page reachable; Worker script name, Pages/Workers kind confirmation from dashboard, deployment version, repository and bindings UNVERIFIED | **RETAIN; DO NOT MODIFY**; account mapping required |
| `alkendi.com` | PUBLIC_LIVE + SOURCE_DECLARED | Personal site; gateway Worker `alkendi-gateway` is defined in LAB repository | Public personal page reachable; exact live script/version linkage not confirmed; live page still showed earlier Facebook URL at last check | Preserve; reconcile production worker + accepted release |
| `lab.alkendi.com` | PUBLIC_LIVE + SOURCE_DECLARED | LAB; repository defines Worker `alkendi-lab-production` | Public HTML shell reachable; ownership and production mapping require account/API confirmation | Preserve; verify runtime and D1 |
| `alkendi-lab-staging` | SOURCE_DECLARED | LAB staging Worker, staging D1 separate | Configured in `scripts/staging/staging-config.mjs`, NOT a live-status check | Check Cloudflare list; retain pending verification |
| `alkendi-gateway-preview` | SOURCE_DECLARED | Personal preview Worker | Configured preview-only in `gateway/wrangler.preview.jsonc`; live deployment not confirmed | Check Cloudflare list; do not delete |
| `alkendi-gateway` | SOURCE_DECLARED | Personal domain Worker | `gateway/wrangler.production.jsonc` and manual release workflow | Check script↔domain binding, version, and DNS without changes |
| `alkendi-lab-production` | SOURCE_DECLARED | LAB production/public catalogue | `scripts/production/production-config.mjs` and `public-catalog-config.mjs` | Verify one actual Worker, route and D1; don't count references as duplicates |
| All Cloudflare Pages projects | UNVERIFIED | Unknown | **Not enumerated** | Obtain account-level Pages list |
| Other Workers, custom domains, routes, schedules, KV, R2, Queues, Durable Objects, D1 | UNVERIFIED | Unknown | **Not enumerated** | Account-level read-only inventory required |

**Separate boundary:** `alkendi.app` AMAN Office is specified as Vercel + Supabase in `docs/04_APPROVED_STACK_DECISION_20261015.md`. Do not classify it as a Cloudflare Worker or migrate it.

### D1 source references (not a live database listing)

- LAB staging `alkendi-lab-staging`: D1 ID `65cbab3f-1f00-443f-a8c4-cf44d3efa8b5` from staging config.
- LAB public catalogue `alkendi-lab-production`: D1 ID `92517c9e-8881-4e65-8f86-e5ab7d2d3d15` from public-catalog config.
- Do not assume the two records are the exhaustive database list or that all production environments agree without account confirmation.

## 2. StackOps source recovery — read-only findings

**Public snapshot:** [Public StackOps V0.1 evidence](./2026-10-23-stackops-public-snapshot.md).  
**Discovered in LAB catalogue:** `public/experience.js`, id `alkendi-stackops`, state `private`, phase `development`, `visible:false`, `url:null`. Related historical intent is recorded in `docs/OWNER_EMAIL_LOGIN_AND_MANAGED_PRODUCTS_20261016.md` and `docs/RELEASE_CANDIDATE_20261020.md`.  
**Search performed:** connected GitHub code search for exact `royal-mud-284d`, `ALKENDI StackOps` and StackOps content, plus list of 15 repositories visible to the authenticated GitHub account. No verified dedicated StackOps source repository was located. This is **not** evidence that no repository exists elsewhere.  
**Current result:** deployed website **exists**; page self-identifies as pilot **V0.1**. Matching source, deploy commit and Cloudflare Worker script name **UNRESOLVED**. **Do not redeploy, delete, rename, or manually replace it.**

**Public site copy characteristics:** advisory flow in three stages; claims client-side processing and export (not tested); proposed service prices Stack Audit €390 once, Stack Launch from €990 once, Stack Care €149/month; page cautions that prices are proposed and exclude vendor charges and applicable tax.

## 3. Catalogue-versus-deployment drift

| Field | Published StackOps page | LAB portfolio catalogue | Result |
| --- | --- | --- | --- |
| Existence | Publicly reachable | Record exists | MATCH — product identity |
| State | Site says pilot V0.1; public URL accessible | `private`, `visible:false`, `phase:development` | REVIEW — not proof of a public commercial launch |
| URL | `https://royal-mud-284d.alkendi.workers.dev/` | `url:null` | **MISSING LINK**, do not auto-publish or update until source ownership + approval |
| Repository | Not exposed on public page | No verified dedicated repo in available project registry | **SOURCE GAP** |
| Production authorization | Not demonstrated | LAB commercial availability not approved here | Keep pilot status |

**No catalogue values were edited in this audit.**

## 4. Security and spending findings

- **Cloudflare plan:** user purchase-complete screenshot shows upgrade to Workers Paid, base price **$5/month**. No verified subscription invoice/balance in an authenticated account read.
- **Hard cap:** official Cloudflare budget alerts are informational, reset per billing period, and do **not** stop/cap billable activity. A proposed $5 extra usage goal is a **soft budget**, not a guaranteed invoice maximum. Ref: https://developers.cloudflare.com/billing/manage/budget-alerts/
- **Alerts:** desired warning thresholds **$1, $3, $5 of cumulative usage-based spending**; **NOT created or verified**. Account read needed; never report these as active.
- **Secrets & permissions:** GitHub workflows reference `CLOUDFLARE_API_TOKEN`, `ALKENDI_CLOUDFLARE_DNS_TOKEN`, account ID, and environment-specific LAB Supabase/D1 configuration. This is a names-only config review, not an audit of actual Cloudflare secret bindings or token scopes. **Do not copy token values into an audit/chat.**
- **GitHub default branch:** an owner-provided screenshot showed `Alkendi-lab-` `main` was not branch-protected. Programmatic protection inspection returned GitHub 403 (`Resource not accessible by integration`). Hence current rule configuration remains unverified; enforce review/checks after administrative inspection and without changing production deployments.
- **Open financial risk:** Workers / Pages functions, D1, KV, R2, Durable Objects and any other pay-as-you-go services may incur different usage charges; only actual billing data can establish spend exposure. Do not set arbitrary global request cap based solely on one Worker.

## 5. Complete account reconciliation — READ ONLY, pending authenticated access

Account identifier from owner Cloudflare dashboard: `199db3fb53056bda569179a435d68729` (not a secret). An authenticated Cloudflare dashboard session is **not available** to this audit run. Browser automation was blocked by external automation-wallet credits and no Cloudflare API token was accessible in this session. This is an access gap, **not an empty resource list**.

Use account-scoped, least-privilege **read-only** Cloudflare authorization, supplied through a secrets manager rather than chat. For each endpoint, paginate and record only identifiers/names, type, status, route, linked resources, risk/cost classifications; do not export sensitive binding values:

1. Workers scripts: `GET /client/v4/accounts/{account_id}/workers/scripts`.
2. Workers custom domains: `GET /client/v4/accounts/{account_id}/workers/domains`.
3. Pages projects: `GET /client/v4/accounts/{account_id}/pages/projects`.
4. Worker deployments/settings: `GET /client/v4/accounts/{account_id}/workers/scripts/{script_name}/deployments` and `.../settings` (redact secret material).
5. D1, KV, R2, Durable Objects, queues and schedules: enumerate relevant account views/GET endpoints with read scope; include empty-result proof where appropriate.
6. Inspect `Manage Account > Billing > Billable Usage > Budget alerts`, usage-based spending, and existing alert recipients; record evidence **without editing**.
7. Inspect API-token *metadata and permissions*, GitHub branch rules, and sensitive bindings by name only; never reveal actual secret values.

Do not use a global API key or token with write privileges merely to complete a read-only audit. Cloudflare API sources: https://developers.cloudflare.com/api/resources/workers/subresources/scripts/methods/list/ ; https://developers.cloudflare.com/pages/configuration/api/ .

## 6. Completion / release gate

| Check | Status |
| --- | --- |
| Public StackOps page captured, source not modified | **DONE** |
| StackOps product-to-LAB catalogue discrepancy identified | **DONE** |
| LAB gateway/staging/production source references inventoried | **DONE — SOURCE ONLY** |
| All Cloudflare Workers + Pages enumerated | **BLOCKED — ACCOUNT ACCESS** |
| Cloudflare domains/routes/DB/bindings mapped to script IDs | **BLOCKED — ACCOUNT ACCESS** |
| StackOps Git source, deployment/commit ownership recovered | **BLOCKED — NO VERIFIED SOURCE** |
| Existing alert and usage totals checked | **BLOCKED — ACCOUNT ACCESS** |
| Secrets permission scopes verified | **BLOCKED — ACCOUNT ACCESS** |
| Existing production services modified | **NO** |

**Next step once read-only access is available:** fill gaps, review resource owners, confirm duplicates by actual Worker ID/route—not name resemblance—then return owner approval requests for any proposed changes. **No deletion, domain migration, billing-setting change, secret rotation or publication is authorized by this audit.**
