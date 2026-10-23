# ALKENDI LAUNCHPAD | WORK_ID ALKENDI-LAUNCHPAD-20261020

**PROJECT_ID:** `alkendi-governance` / reusable non-runtime delivery utility.  
**TARGET_REPOSITORY:** `Amankendi/Amankendi`  
**SKILL_SELECTED:** canonical `AMAN Product Build Standard` + project isolation + release gate.  
**ADOPTION_LEVEL:** v0.1 source implementation proposed for PR; no global ChatGPT skill installed.  
**BASELINE:** `docs/00_AMAN_PRODUCT_BUILD_STANDARD.md`, `docs/02_PROJECT_ISOLATION_STANDARD.md`, `docs/04_APPROVED_STACK_DECISION_20261015.md`, and existing H01–H10 policy.

## Intent and scope

Create a repeatable path for owner-controlled creation, code review, manually approved Cloudflare static site deployment, and customer source handoff, preserving one private repository per new product/customer. This does not consolidate data or secrets and is not itself another product runtime.

## Approved user rules translated into technical constraints

1. Internal project → private `Amankendi/alkendi-{slug}` source repo.
2. Customer project → private `Amankendi/client-{slug}` source repo; independent customer ownership boundary.
3. Credentials/providers signed in once per authorized execution environment, but repository-level resource binding remains separate.
4. No auto-publish or DNS/domain/DB/account transfer.
5. Customer export includes safe source ZIP, manifest, checksum; repository ownership and H01–H10 require separate acceptance and legal steps.
6. No alteration of LAB or Office deployments. Existing apps are not force-migrated by this starter.

## v0.1 implementation

- `tools/alkendi-launchpad/launchpad.py`: Python standard-library CLI for `new`, `doctor`, `github`, `deploy`, and `export`.
- `tools/alkendi-launchpad/tests`: isolated stdlib tests for manifest, policies, dry run, exclusion, checksums and secrets.
- Generated static Cloudflare Worker `wrangler.jsonc` and manual-dispatch-only GitHub workflow.
- Safe GitHub creation is **opt-in**: `--approve`; defaults are private and never rewrite an existing local Git repo.
- Handover checklist maps to canonical H01–H10 and identifies independent verification obligations.

## Status record

- **DONE (source):** Implementation and docs staged; no provider mutation.
- **TESTED (local):** 8 unit tests passed on 2026-10-20; does not include end-to-end GitHub/Cloudflare runtime.
- **FAILED:** None in the listed 8 unit tests.
- **BLOCKED:** GitHub CLI authentication and Cloudflare per-repository secret integration have not been exercised; no new GitHub repo created or live Worker published.
- **SECURITY / PRIVACY:** Public shared tool only, no private inventory; private output repos, source-level secret scan and export exclusions. Scanner is not comprehensive; must still review actual deliverable.
- **CROSS-PROJECT DEPENDENCIES:** Template contract only. Source utility has no production data linkage to other projects.
- **COST / TOKEN IMPACT:** Python stdlib no runtime subscriptions; GitHub/Cloudflare charges may apply depending on account limits and project usage; no pricing claims validated by a live meter.
- **MIGRATIONS / API IMPACT:** None. Uses local Git/GitHub CLI commands when explicitly approved, and generated manual GitHub Actions workflow for static Cloudflare deploy.
- **ROLLBACK:** Revert this source-only PR; no production resource has been altered.
- **NEXT:** Human PR review, integration pilot in a new private sandbox repo, verified Cloudflare live smoke test, then GUI with explicit audited owner controls and connectors. Add adapters for existing codebase/Next.js only after scoped project review.

## Acceptance limitations

A functional hosted one-click dashboard is **NOT IMPLEMENTED** in this version. Cloudflare configuration and GitHub Actions output are code templates, not live evidence. No auto-synchronized ChatGPT auth. Do not mark release ready until CI, owner approval, live tests and handover evidence pass.
