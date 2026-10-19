# ALKENDI Skill Routing Entry Point (proposed)

## Purpose
Prevent repeat explanations. This document is **not** an automatic installation in ChatGPT or Claude and should never be reported as one. It is a bootstrap contract for repository-aware agents that read AGENTS.md / CLAUDE.md; any other agent must explicitly be configured to read it.

## On every ALKENDI task
1. Determine `PROJECT_ID` from the current request and source registry `config/project-registry.json`; use past approved baseline, do not assume a new scope.
2. Read repository `AGENTS.md` and if operating in Claude `CLAUDE.md`, plus the target project's approved `PROJECT_MASTER_SPEC`, `PRODUCT_BASELINE`, current sprint and recent relevant decisions.
3. Choose an applicable **already approved** method/skill from the routing table below. A reference-only candidate is **not installed or runnable**.
4. Execute the smallest approved incremental delta, with tests and evidence; never ask the owner to repeat known specifications solely because the chat is new.
5. Ask only for one truly missing material decision. Do not make up source or test status.
6. Record in the work item: `PROJECT_ID`, `SKILL_SELECTED`, `SOURCE_PATH`, `ADOPTION_LEVEL`, `BASELINE_REVISION`, `WHAT_REUSED`, `TESTS`, `BLOCKERS`.

## Routing table
| Request intent | Primary approved method | Source and current reality |
| --- | --- | --- |
| Build/edit existing app | AMAN Product Build Standard + APLC | `docs/00_AMAN_PRODUCT_BUILD_STANDARD.md` and project approved baseline, canonical operating method |
| Evaluate an external agent | ALKENDI Agent Toolkit | `skills/alkendi-agent-toolkit/SKILL.md`, merged reference-evaluation skill only |
| New/unclear feature | Existing master spec and current sprint first | `docs/00_AMAN_PRODUCT_BUILD_STANDARD.md`; `AT-01` is reference-only |
| Bug or behavior change | Test-first workflow | `AT-03` reference-only; separate Office pilot PR #64 is not merged/installed |
| Browser/UI change | Existing QA protocol | `AT-04` reference-only; browser tools must be explicitly available and permitted |
| Auth, payment or customer data | Existing security and project isolation rules | `docs/02_PROJECT_ISOLATION_STANDARD.md`; `AT-05` reference-only |
| Release and pipeline | Existing repository CI and owner release gate | `AT-06` reference-only, no auto-publish |
| Infrastructure choice | Binding architecture decision | `docs/04_APPROVED_STACK_DECISION_20261015.md`; AMAN Stack Architect Office #61 and Lab #34 unmerged |
| Business development / local SEO | Approved user brief, verify portable skill availability | Do not claim ALKENDI LOCAL GROWTH installed in this repository without finding its actual committed path |
| Client handover | Existing AMAN Build handover requirement | Provide scoped source, tests, deployment/rollback, ownership, documentation and transferable artifacts |

## Provider-specific limitations
- **ChatGPT conversation:** GitHub documents are not guaranteed to be injected into every new conversation. The assistant must retrieve relevant project baseline/tools when available; otherwise disclose the limitation. Actual reusable ChatGPT skills require a supported account/plugin/skill registration path, not just GitHub merge.
- **Claude / Umayr:** Opening a Claude session is not proof that a skill from another repository was installed or loaded. Project-local CLAUDE.md should point to this routing contract when explicitly integrated, and the runtime must be verified.
- **Codex:** AGENTS.md in a repository can direct repository-aware workflows, but only when this repository context is actually loaded. External project repositories need scoped alignment.
- **Shared toolkit:** 5 source repos/8 candidates are references. No automatic npm, MCP, remote script execution or mass installation.

## Required verification of adoption
1. Start a fresh coding-agent session with repository access and a simple existing project change request.
2. Check it identifies the correct project baseline and states which approved skill/method is active **without the owner restating it**.
3. Verify a code review / local test identifies the expected behavior.
4. Record provider, environment, skill loading evidence, tokens/cost and any failure. No claim of automatic reuse until the above is observed.
