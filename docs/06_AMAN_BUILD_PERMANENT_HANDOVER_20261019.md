# AMAN Build — Permanent Project Handover Standard
**ID:** ALKENDI-DELIVERY-HANDOVER-001 | **Version:** 1.0 | **Date:** 2026-10-19 | **Status:** Owner-approved delivery policy; individual execution requires evidence.

## Binding obligation
Every AMAN Build quotation or Statement of Work (SOW) MUST include H01–H10 as enumerated, measurable outputs. They are deliverables owed at the agreed acceptance milestone, not an upsell or a later proposal. Price them in the bundled quoted work; do not add a separate surprise fee for required documents/exports at closeout. For approved no-charge projects, quote €0 for the developer's contribution and retain all ten duties. Additional optional support is always a separately approved service.

## Handover matrix (copy per project)
| ID | Deliverable | What to deliver | Minimum acceptance proof | State | Owner/recipient receipt |
|---|---|---|---|---|---|
| H01 | Source & release | Repository and release tag, full project-owned source, license inventory, lockfile, reproducible build instructions, CI plan | Build from fresh clone at signed/tagged candidate; code inventory complete | PENDING | |
| H02 | Infrastructure & DNS | Hosting/provider IDs (not secrets), IaC/deploy settings, environments, DNS inventory, integration map, rollback | Independent clean provision walkthrough without cutting over unrelated domains | PENDING | |
| H03 | Data & portability | Tables/models/migrations/roles, lawful export, import and deletion/retention runbooks, format description | Restore a sanitized dataset; permission and ownership tests | PENDING | |
| H04 | Admin access | Admin console instructions, account roles/RBAC, onboarding, ownership-transfer steps | Recipient demonstrates account and admin functions; no hidden LAB-only dependency | PENDING | |
| H05 | Operations manual | Arabic manual (and any contracted languages), schedules, monitoring, incident handling, service contacts | Operator completes agreed business tasks with manual | PENDING | |
| H06 | Security/privacy | Threat and risk register, applicable GDPR/privacy documents, sensitive/children content safeguards, permission review, incident plan | Verified risk register and documented unresolved exceptions | PENDING | |
| H07 | Finance & renewals | Hosting, domains, API/audio/meeting/storage/license fees; actual vs estimates; provider-owner renewals and termination | Each cost labelled free/actual/estimate/unknown; billing owner confirmed | PENDING | |
| H08 | Rights & custody | Rights chain/licensing, original assets, accounts/domains, signed gift/assignment/license and asset receipt where legally supported | Recipient has necessary transferable rights and independent custody; third-party terms acknowledged | PENDING | |
| H09 | QA & acceptance | Test suite, CI logs/SHAs, browser/mobile/accessibility/security tests, bug register, limitations, UAT acceptance | PASS per agreed user journey at release SHA; FAIL/BLOCKED visible | PENDING | |
| H10 | Backup & recovery | Safe backup/export location, schedule, keys escrow method, restore instructions and time objectives, recovery drill | Independent sanitized restore demonstrated and dated; no plaintext secrets in handover | PENDING | |

**Evidence form:** PROJECT_ID / recipient / quotation-ID / latest tested immutable SHA / deployed release or `NOT LIVE` / each H-state & artifact location / verification date & tester / recipient acceptance / open blockers.

## Ownership and service independence
- ALKENDI LAB prepares each project separately; shared business/private runtime resources are not an acceptable short cut.
- Move to recipient-controlled GitHub/hosting/domain/DNS/auth/storage/analytics accounts as feasible, using documented reversible migration; never move accounts without the recipient's affirmative consent.
- The signed transfer concerns only material and intellectual property legally controlled by the transferor. Open source or vendor content remains governed by upstream licenses; moral rights and assignment formalities follow governing law. Brand attribution does not grant permanent hosting/control rights.
- A **gift/waqf intention** is an agreed no-charge development/transfer purpose; whether a formal waqf or legal assignment exists requires the correct written instruments and any applicable registration/validity requirements.

## Non-negotiable acceptance and continuity
1. State what is **PROTOTYPE / INTEGRATED / STAGING / PRODUCTION VERIFIED**. A published static demo is not a full service.
2. Test real tenant isolation, child safety and consent when needed, login, uploads, backup restore, error recovery, email/audio rights and device/browser behavior.
3. Export format must be documented and use commonly readable artifacts (git/source, SQL/CSV/JSON as appropriate); encrypt and restrict any genuine user data.
4. Owner/recipient gets a final immutable version manifest with dates, artifact hashes, access transition receipt and re-provision runbook. Never place plaintext tokens or personal data in repositories or PDF screenshots.
5. Developer access must be revoked/rotated by the recipient **after** confirmed independent access and tested recovery, not as a surprise destructive change.
6. Explicitly record unknowns and blockers; never certify transfer or restoration where unperformed.

## APLC workflow embedding
- Requirements: include transferability, project isolation, licensed content and future operator role in acceptance.
- Design: include H01–H10 in scope and quotation.
- Test: verify portability/restoration and admin paths with actual evidence.
- Implement: collect final manifests/scripts/docs without a late refactor.
- Deploy: record known endpoint and logs, rollback, actual runtime status.
- Improve: receive operator handover signoff and track remaining open risks as scoped support.

## Two independent Quran-related gifts (owner decision 2026-10-19)
The owner approved **free development and handover** of two **distinct** projects to their respective intended recipients. Reuse this standard, but do not make their source, users, runtime data, accounts or credentials shared. Their existing demonstration Sites remain intact until each project's verified replacement is accepted. Do not invent a verified export from ChatGPT Sites or claim production services enabled before confirmed implementation/testing. The separate scope/receiver/legal documents live with each project, not in the central shared governance repository.

## Quotation requirement
See `templates/AMAN_BUILD_QUOTATION_DELIVERABLES_AR.md` for exact Arabic clause and ten mandatory client-facing lines.
