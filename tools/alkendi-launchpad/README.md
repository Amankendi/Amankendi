# ALKENDI LAUNCHPAD — Project Factory V0.1

**Status:** Runnable local CLI source and tests. It is **not** an installed hosted dashboard, nor does it prove credentials, CI, or production deployment.

**Purpose:** One reusable operating method for new ALKENDI or customer websites without repeating provider sign-ups and without pooling distinct projects into one repository.

## One-time preparation

- Authenticated GitHub CLI (`gh auth login`) and Git with an identity configured, on the operator workstation or approved agent runtime.
- Authenticated Cloudflare account. Keep project-scoped `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` in **each** repository's GitHub Actions Secrets (or approved restricted environments), never in source or ZIPs.
- The production domain and DNS are **separate approval steps**; never modify existing mail, nameservers or other projects automatically.

## New project — internal versus customer

```bash
python3 launchpad.py new --name 'ALKENDI Demo' --slug alkendi-demo --kind internal --workspace ~/projects
python3 launchpad.py new --name 'Customer Showcase' --slug customer-showcase --kind client --workspace ~/projects
python3 launchpad.py doctor ~/projects/customer-showcase
python3 launchpad.py github ~/projects/customer-showcase              # DRY RUN
python3 launchpad.py github ~/projects/customer-showcase --approve    # PRIVATE repo + push, not deployment
python3 launchpad.py deploy ~/projects/customer-showcase              # DRY RUN
python3 launchpad.py deploy ~/projects/customer-showcase --approve    # request production workflow, verify separately
python3 launchpad.py export ~/projects/customer-showcase --out ~/handoffs
```

**Publishing gate:** Build/design/CI review first; dispatch the `Production deploy` GitHub Actions workflow manually, typing `DEPLOY`. The workflow does not run on `push`. Set Cloudflare secrets for that single project before dispatch. GitHub Actions `production` environment may additionally be configured with protection/reviewers.

**Customer model:** ALKENDI maintains each customer's source in its **own private GitHub repository** (`Amankendi/client-{slug}`), with isolated identity, hosting, secret and database boundaries. Handover ZIP includes source + JSON handover manifest + SHA256 file, but *does not transfer* GitHub ownership, domain, hosting, secrets, data, license or IP rights. Transfer those only after an explicit customer contract and acceptance procedure. Avoid retaining unneeded customer credentials after handover.

**Existing sites:** V0.1 does not import/overwrite established repositories. For an existing project, identify its current repository and approved stack; do a separate reviewed migration/adoption PR. This factory does not touch `Amankendi/aman-executive` or `Amankendi/Alkendi-lab-` live deployments.

**Boundaries:** No secrets, private records, client identities or customer portfolio records are stored in the public governance repository. Each new private project records its own metadata. No shared runtime, database, Auth tenant, DNS, credentials or service role. The static starter is deliberately simple. Full-stack data migrations, domain provisioning and graphical one-click admin UI remain outside V0.1.

## Next milestone

1. Review this PR, test `new`/`export` in a controlled environment, approve architecture/UX.
2. Connect it to an authenticated internal ALKENDI LAB admin panel with a create → review → approve → publish → export sequence, backed by audited APIs and separate project credentials.
3. Add reviewed adapters for an existing codebase (React/Next.js), automatic GitHub repo creation and restricted provider onboarding per product, plus checks for licenses, backups, invoices, and client contract.

## Security test

```bash
python3 -m unittest discover -s tests -v
```

The test suite validates local source behaviors only; it does not claim a working GitHub/Cloudflare credential integration.
