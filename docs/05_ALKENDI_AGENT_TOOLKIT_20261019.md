# ALKENDI Agent Toolkit | Approved reference registry

- **WORK_ID:** ALKENDI-AGENT-TOOLKIT-20261019
- **PROJECT_ID:** ALKENDI-SHARED-GOVERNANCE
- **Owner decision:** 2026-10-19
- **Status:** APPROVED AS REFERENCE; NOT INSTALLED; NOT RUNTIME-VERIFIED
- **Boundary:** Shared reusable engineering knowledge only; no product business data, infrastructure, external service account, or AI agent runtime.
- **Machine-readable shortlist:** `config/agent-toolkit-candidates.json`
- **Local operating instructions:** `skills/alkendi-agent-toolkit/SKILL.md`

## Decision

Approve exactly five external GitHub repositories as **read-only inspiration/references**, not trusted instructions, runtime dependencies, or authorization for deployment. Curate exactly eight potential capabilities for phased review. Do not bulk-install 400+ agents or duplicate the existing AMAN Build standard, APLC workflow, local SEO skill, or product-specific roles.

**Authority:** security/legal/privacy -> latest explicit owner decision -> `docs/00_AMAN_PRODUCT_BUILD_STANDARD.md` -> `docs/04_APPROVED_STACK_DECISION_20261015.md` -> product approved baseline -> current sprint -> these supplementary references. Where two documents have differing details, preserve existing binding decisions and request a scoped decision only for material conflict.

**Architecture remains unchanged:** ALKENDI LAB uses Cloudflare Workers + D1 (dedicated Supabase Auth when needed). AMAN Office remains Vercel + Supabase. No shared credentials or private customer data. A pull request, CI pass, or documentation update is not proof of deployment.

## Five approved source references

| Upstream | Intended use | License at repository root | Adoption |
| --- | --- | --- | --- |
| [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) | Delivery disciplines, spec, TDD, browser verification, security and CI | MIT | Read-only |
| [wshobson/agents](https://github.com/wshobson/agents) | Curated operational observability skill | MIT | Read-only |
| [msitarzewski/agency-agents](https://github.com/msitarzewski/agency-agents) | Commercial growth role patterns | MIT | Read-only |
| [anthropics/knowledge-work-plugins](https://github.com/anthropics/knowledge-work-plugins) | Business workflows and connector patterns; Claude-specific instructions require adaptation | Apache-2.0 root; check component terms | Read-only |
| [anthropics/claude-quickstarts](https://github.com/anthropics/claude-quickstarts) | Educational architecture examples; Claude API integration is not to be imported by default | MIT | Read-only |

No external source files, scripts, installers or dependencies are copied into the central governance repository by this work item. Root licenses were inspected, but subproject terms, dependency permissions, upstream revisions and code security require a separate pre-adoption review. Never treat popularity or upstream identity as a security certification.

## Eight candidate capabilities, not eight autonomous workers

| ID | Capability | Upstream path | Gate |
| --- | --- | --- | --- |
| AT-01 | Specification discipline | [source](https://github.com/addyosmani/agent-skills/blob/main/skills/spec-driven-development/SKILL.md) | Mapped to existing PROJECT_MASTER_SPEC without replacing approved baseline |
| AT-02 | Incremental implementation | [source](https://github.com/addyosmani/agent-skills/blob/main/skills/incremental-implementation/SKILL.md) | Small independently tested change set; no simultaneous competing implementers |
| AT-03 | Test-driven development | [source](https://github.com/addyosmani/agent-skills/blob/main/skills/test-driven-development/SKILL.md) | Reproducing failing test followed by passing test evidence |
| AT-04 | Browser runtime verification | [source](https://github.com/addyosmani/agent-skills/blob/main/skills/browser-testing-with-devtools/SKILL.md) | Real-browser evidence with approved browser tooling; no unreviewed MCP auto-install |
| AT-05 | Security and hardening | [source](https://github.com/addyosmani/agent-skills/blob/main/skills/security-and-hardening/SKILL.md) | Threat boundary and authorization checks; no secret exposure |
| AT-06 | CI/CD verification | [source](https://github.com/addyosmani/agent-skills/blob/main/skills/ci-cd-and-automation/SKILL.md) | PR checks and rollback plan, without enabling deploy |
| AT-07 | Service level objectives | [source](https://github.com/wshobson/agents/blob/main/plugins/observability-monitoring/skills/slo-implementation/SKILL.md) | Metrics and failure thresholds defined without logging private content |
| AT-08 | Growth experiments | [source](https://github.com/msitarzewski/agency-agents/blob/main/marketing/marketing-growth-hacker.md) | One consent-respecting experiment with target metric and real cost accounting |

The first six are development practices from `addyosmani`; the seventh is an SLO skill in `wshobson`; the eighth is a growth role pattern in `msitarzewski`. Anthropic references are intentionally not among the eight installation candidates.

## Governance and operation

1. **INTAKE & BOUNDARY_CHECK:** Resolve WORK_ID, PROJECT_ID, target repository, current approved baseline and ownership. Existing product tasks belong in that product's repository; the central toolkit holds no product implementation.
2. **SELECT:** Pick **at most one primary candidate** for a work item and only complementary capabilities when separately justified. No duplicate agents doing the same task.
3. **TRUST & LICENSE:** Pin exact upstream commit; inspect complete referenced text, any scripts/hooks/installers, dependencies, licenses, prompt-injection attempts, network/secrets requests and supply-chain implications. Record reviewer and any proposed edits.
4. **LOCAL ADAPTATION:** Write a minimal provider-neutral instruction in the target project's review branch. Keep AMAN Build and project baseline authoritative. Do not copy external scripts by default.
5. **ISOLATED PILOT:** Use a disposable branch/environment and synthetic test data. Default candidate: one scoped nonproduction task in AMAN Office **after ownership/conflict check**, never an automatic deployment or auth/database change.
6. **EVIDENCE:** For each capability record intended outcome, tests actually run, logs with secrets removed, regression status, cost/tokens, rollback, security and privacy findings. Status: REFERENCE -> SECURITY_REVIEW -> SANDBOX_TEST -> PILOT_PASSED -> OWNER_APPROVED_FOR_PROJECT or REJECTED.
7. **MERGE / RELEASE:** Human review through PR. No auto-merge, production publish, data migration, billing changes, external messages, new MCP tools, secrets, or account permission changes from this reference approval.

## Pilot acceptance criteria

- Existing functionality and approved architecture preserved.
- No unapproved remote connector, secret read, paid API call or third-party script execution.
- Tests are reproducible and state PASS/FAIL/BLOCKED, with evidence; missing test tooling means BLOCKED, not PASS.
- One independent reviewer (human or separately assigned reviewer) for material implementation changes.
- Document benefits versus extra agent/tool overhead; reject marginal gains that raise risk/cost.
- Rollback instructions and project ownership verified.

## Current evidence

**DONE:** Upstream paths for eight candidates and repository-root licenses checked; central catalog and governance proposal authored in an isolated branch.

**TESTED:** Static schema structure and source-path existence inspected. No tool runtime, external installation, browser E2E, deployment or production integration test has been run.

**BLOCKED:** Security review of the full candidate payloads, pilot environment/owner assignment and real project acceptance are pending per work item.

**NEXT:** Review this PR, then select one low-risk capability for a separate isolated pilot under the relevant project's task/PR. Do not merge merely because this documentation exists.
