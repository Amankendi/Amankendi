# ALKENDI LAUNCHPAD — Internal project factory / Control Plane V1 Beta

**Work ID:** `ALKENDI-LAUNCHPAD-20261020`  
**Status:** source implemented; local mocked integration tested; **NOT LIVE / NOT CONNECTED**.  
**Account:** `Amankendi`.  
**Product boundary:** separate `alkendi-launchpad-control` Cloudflare Worker and isolated D1; not installed in ALKENDI LAB or AMAN Office runtime.  
**Runtime target:** Cloudflare Workers + D1, Cloudflare Access + GitHub API, GitHub Actions central broker.

## What actually works in code

- RTL mobile-friendly dashboard: project list, stats from D1, search, filter, new project, details, audit, approval, deploy request, ZIP download.
- One request creates a **new private** GitHub repository `Amankendi/alkendi-{slug}` for internal projects or `Amankendi/client-{slug}` for clients. Each repo receives `public/index.html`, `AGENTS.md`, `docs/01_PROJECT_MASTER_SPEC.md` with the owner's optional creative brief, project manifest and an isolated static-site configuration.
- Cloudflare Access JWT RS256 signature validated on **every** dashboard and API request with explicit Audience, Issuer, owner-email allowlist, expiry. No unprotected preview mode; requests fail closed when unconfigured.
- D1 stores only project metadata and audit events, not client customer/business data, service credentials, or source archives.
- Approval pins the GitHub HEAD SHA. Deploy requests are dispatched to the **single central broker**, which runs only when the reviewed SHA is still HEAD. It creates its own isolated static config in a trusted runner temporary directory, not from the customer's source-controlled Wrangler config. It never touches DNS.
- Client export reads allowed source files directly from the private repository and returns a real ZIP plus H01–H10 receipt/checklist, while blocking common credentials and risky files. This is an **engineering package** only: no legal IP transfer or live service migration by ZIP.

## One-time setup — not per project

1. Obtain owner-controlled Cloudflare account with Workers and Access available; configure the desired verified subdomain route (e.g. `launchpad.alkendi.com`) without changing unrelated nameservers or mail records.
2. Create **separate** D1 database `alkendi-launchpad-control`. Set its actual ID in `wrangler.jsonc`. Never point at ALKENDI LAB's production D1 or AMAN Office Supabase.
3. Create Cloudflare Access application for the control plane; select only the owner's verified email; record Access Team domain and Application AUD. Set these in `wrangler.jsonc`, and set `OWNER_EMAILS` to the real authorized email(s).
4. Issue a GitHub credential with minimal required permissions for authenticated owner repository **creation and private source writes**, plus permission to dispatch the central governance Action. Save it only with `wrangler secret put GITHUB_TOKEN`. Review token scopes: a fine-grained PAT may be insufficient for user-repository creation depending on GitHub settings; GitHub App user authorization is the better production evolution. Never commit the token.
5. In governance repository `Amankendi/Amankendi`, after reviewing/merging the broker workflow, set **once**: `GH_PRIVATE_SOURCE_READ_TOKEN` (read-only private repo checkout), `CLOUDFLARE_API_TOKEN` (scoped Workers deploy), `CLOUDFLARE_ACCOUNT_ID`; set GitHub `production` environment reviewers/controls. Broker workflow is `/.github/workflows/launchpad-deploy.yml`.
6. With Wrangler authenticated in an owner-approved administration environment, run:

```bash
cd control-plane
npm install
npm run check
npx wrangler d1 migrations apply alkendi-launchpad-control --remote
npx wrangler secret put GITHUB_TOKEN
npx wrangler deploy
```

7. Verify Access rejects unlisted emails, dashboard reads projects, private repo creation works in a **throwaway** test project, HEAD pinning and central broker Action are recorded, and an actual `.workers.dev` static pilot endpoint passes smoke tests. Do not attach a live domain or customer data until accepted.

After this connection, creating additional isolated static projects does **not** require new provider sign-in or a new GitHub Actions secrets configuration per repo. The control plane retains only its one GitHub connection; central broker retains Cloudflare deployment credential. Cloudflare account capacity, GitHub rate limits and plan costs still apply.

## Current hard limits

- New-project starter is deliberately **static** and minimal. Real design/UI must be implemented using the approved owner brief in the new project repository, through a reviewed coding-agent or developer PR. Launchpad does not pretend that a placeholder equals a finished custom website.
- Browser build/publishing for arbitrary React/Next.js, databases, e-commerce, payments, email, secrets rotation, custom domains, customer hosting-account transfer, and mobile app stores **are not included** in V1 Beta.
- `dispatched` means a workflow request was accepted, not that the site was published; confirm GitHub Actions and live endpoint before claiming success.
- Security scan is defense-in-depth, not a guarantee. Human review is mandatory for secret-bearing projects, large repositories, licensed assets or private production data.
- Cloudflare Access route, account configuration, real provider tokens, GitHub environment reviewers, worker URLs, domain DNS and live deployments **are unverified** in this source bundle.

## Tests

```bash
node --test tests/*.test.js
```

Ten Node tests cover naming, starter files, zip compatibility, token exclusions, signed Access auth, cross-origin blocking, protected serving, plus a mocked GitHub/D1 lifecycle from create to source export. Never substitute mocked tests for live Cloudflare checks.

## Stop/rollback

Disable Access application/Worker route if misconfigured; rotate leaked credentials; disable workflow dispatch if suspect. Revert a PR to restore source. Separate Workers can be rolled back without changing ALKENDI LAB / AMAN Office; independent D1 metadata backup is required before destructive migrations.

**The repo is a proposed private product source.** This code may be reviewed in the governance repository as a staging utility but should be moved to an **isolated** private repository before an actual control-plane deployment, to respect project isolation. Do not deploy from the governance source tree as a new unrelated application.
