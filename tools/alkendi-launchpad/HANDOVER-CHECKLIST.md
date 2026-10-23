# ALKENDI customer handover | H01–H10

**Template only.** A source ZIP alone does not complete any contractual handover. Each item must be supported by a deliverable, verified by an independent recipient, and signed off. Use FAIL/BLOCKED until real evidence exists. The quote must include all H01–H10 in the project price, including fee €0 when formally approved as pro-bono/waqf-intended.

- [ ] **H01** Project-owned source, reproducible build/release, tagged revision, checksum and rights scope.
- [ ] **H02** Hosting/deployment/DNS inventory, ownership, recovery and rollback procedure.
- [ ] **H03** Database structure, migrations, independent export and restore evidence (N/A only where no DB exists, documented).
- [ ] **H04** Admin console, authorization roles, control of administrator access; verify with new owner.
- [ ] **H05** Operations, support, maintenance and update manuals.
- [ ] **H06** Security/privacy/safeguarding register, incident handling, retention and consent responsibility.
- [ ] **H07** Itemized real/estimated costs, subscriptions, renewals and provider ownership.
- [ ] **H08** Transferable visual/assets/IP/license rights inventory and signed handover receipt.
- [ ] **H09** QA/UAT evidence, known defects, target acceptance and production smoke test.
- [ ] **H10** Independent backup/restore and business recovery exercise results.

## Release logistics

- [ ] Confirm signed customer identity and contract; never assume ZIP automatically assigns copyright.
- [ ] Compare SHA256; record approved version, access list, release timestamps.
- [ ] Deliver secrets through an authorized secure channel, rotate credentials after transfer; **no secrets in ZIP**.
- [ ] Decide repository transfer vs independent export. For repo transfer confirm target's verified GitHub identity and consent.
- [ ] Confirm cloud account, domain/registrar and email DNS arrangements; preserve unrelated services.
- [ ] Perform receiver acceptance and revoke ALKENDI permissions when contract requires it.

Reference: `docs/06_AMAN_BUILD_PERMANENT_HANDOVER_20261019.md` and canonical AMAN Build H01–H10 policy.
