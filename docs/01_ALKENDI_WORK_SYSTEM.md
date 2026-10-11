# ALKENDI Work System v1

## Purpose

Turn conversations into a reproducible operating system for product work while keeping ChatGPT and Claude complementary rather than duplicative.

## Source-of-truth model

- **Conversation:** intent, discussion, clarification, owner decisions.
- **Global governance repository:** standards, role contract, project registry and boundary policy.
- **Project repository:** business truth, implementation, migrations, tests and release evidence.
- **GitHub issue/PR:** durable work/handoff record.

No critical decision may exist only in an agent's private context.

## Work item identity

Every meaningful item receives:
- `WORK_ID`
- `PROJECT_ID`
- `TARGET_REPOSITORY`
- owner objective
- in-scope / out-of-scope
- acceptance criteria
- security/privacy classification
- dependencies
- current stage

## State machine

### 0 — INTAKE
ChatGPT / AMAN converts the conversation into a precise work item. Facts and assumptions are separated.

### 1 — BOUNDARY_CHECK
Determine exactly one routing class:

**A. Existing project feature**
Route to that project's current system-of-record repository.

**B. Independent product/system**
Do not insert it into another product. Require a new repository/system boundary before implementation.

**C. Shared reusable capability**
May live in a shared utility/library only if it owns no project-specific business truth and exposes a documented interface.

**D. Research/reference only**
No production integration until promoted through a new reviewed work item.

If classification is uncertain, status is `BOUNDARY_BLOCKED`; coding does not start.

### 2 — STAGE_1 / ChatGPT-AMAN
ChatGPT / AMAN prepares:
- problem and expected outcome;
- verified current state;
- first architecture or implementation;
- data/security/privacy constraints;
- boundary map;
- cost/token strategy;
- acceptance criteria;
- explicit unknowns.

Stage 1 is not repeated by Claude unless a concrete defect is found.

### 3 — CLAUDE_REVIEW
Claude / Umayr:
- audits Stage 1;
- checks repository fit and project isolation;
- improves engineering structure;
- identifies contradictions and duplicate capabilities;
- records requested corrections;
- chooses the smallest correct implementation path.

### 4 — IMPLEMENTATION
Claude / Umayr normally executes the approved engineering path in GitHub using branch → tests → PR.
ChatGPT may implement directly when explicitly assigned, but the roles and review separation must remain clear.

### 5 — CHATGPT_ACCEPTANCE
ChatGPT / AMAN reviews the PR/result against:
- owner intent;
- canonical requirements;
- security/privacy;
- project boundaries;
- duplication;
- cost/token behavior;
- tests and deployment reality.

### 6 — INTEGRATION_CHECK
Only when the plan requires integration:
- verify contract compatibility;
- verify auth/authorization;
- verify tenant/data isolation;
- verify failure/retry behavior;
- verify no duplicate source of truth.

If no integration is needed, an independent project remains isolated.

### 7 — VERIFIED
A work item reaches VERIFIED only after evidence meets its acceptance criteria.
Report `DONE / TESTED / FAILED / BLOCKED / NEXT`.

## Async/background operation

Agents may work asynchronously through GitHub issues, branches, PRs and scheduled deterministic checks.
"Background" never means untracked autonomous mutation. Every durable change must remain inspectable and attributable in GitHub or the project's approved runtime audit.

## Change rule

Do not restart planning from zero when an approved baseline exists. Improve the current baseline and record the delta.
