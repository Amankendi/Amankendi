# Focus: ALKENDI Lab activation + AMAN Office experience

Owner decision: 2026-10-12 02:07 Europe/Paris.

**عبدالرحمن الكندي لا يساوم في الدقة.**

## Binding operating decision
Only `alkendi-lab` and `aman-office` are active product workstreams. Global governance and existing shared utilities may support these two only. All other development, autonomous project work, scheduled project reviews and paid agent calls are paused until the owner explicitly reactivates the named project. Pausing preserves source, data and recovery paths. It is not cancellation or authorization to remove an existing customer service.

Read this decision before picking up any old backlog. A newer owner instruction overrides the pause only for the explicitly named scope. Do not reopen completed work. Do not launch duplicate agents.

## Mandatory project intake
Ask the owner at intake: actual project, temporary client demo, or cancelled? Record the answer; do not infer cancellation from inactivity.

| Classification | Required state and execution rule |
| --- | --- |
| actual | Objective, owner, source repository, next executable task, acceptance criteria, budget and approved platforms. Only the two focus projects are active now; other actual projects stay paused. |
| demo | Temporary/on-demand only. Record an owner-agreed expiry/review date, recipients, synthetic-data policy and budget. No recurring AI jobs, paid API calls, auto-renewal or unattended builds by default. Expiry disables execution and archives the demo; never silently deletes user data. |
| cancelled | Freeze execution and archive by default. Deletion requires exact assets, dependencies, backup/retention impact and explicit owner authorization. |
| unclassified | INTAKE_REQUIRED; no build, AI or integration job until classified and authorized. |

Each work record carries PROJECT_ID, WORK_ID, project_kind, work_state, owner, source_of_truth, next_action, budget, expires_at (required for demo activation), platform inventory, dependencies and evidence. Registration and lifecycle transitions should use code/rules rather than LLM calls.

## Verified evidence this turn
- Existing global partnership, isolation standard and registry already merged in PR #1; do not recreate.
- ALKENDI Lab Site ID: appgprj_6ac184cee6ac81919319adfc514e729d; saved version 3; source checked out at 54829f6332400846d7863d24b1276140e213f40c.
- Hosting access is owner-only (custom allowlist, owner only, zero external visitors). Public customer access is not enabled.
- Lab source has D1 project/task/quote/message/delivery/member/subscription records and server-side role checks. Preserve its approved design.
- Hosting environment inventory contains ALKENDI_ADMIN_EMAILS, NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY only. Stripe/OpenAI keys and webhook-ready configuration were absent from that inventory. Do not expose or copy secret values.
- No MCP server is declared by the published Lab Site. Site connector eligibility discovery is not exposed in this session; arbitrary plugin integration is not verified.
- Lab automated source tests: 23 passed, 0 failed (`node --test tests/*.test.mjs`). Provider calls are mocked and frontend tests run in Node: no real payment/auth/provider journey or browser verification is claimed.
- No attached Site schedules were returned for the five owned Sites inspected.
- Paused ChatGPT automations: ONO3D readiness (6aad4bee00948191b3fa607d0c1f110a) and weekly article (6abd7ce9b3588191b531fae356c0bb4f). Other non-Office automations were already disabled. Three Office automations remain enabled.
- Claude sessions and runtime jobs cannot be stopped through this GitHub record. Receipt and pause evidence are required from Umayr. No blanket claim that all platforms are stopped.
- AMAN code is in Amankendi/aman-executive. Its relationship to the private Claude Artifact has not been verified; do not overwrite the Artifact based on assumptions.

## Stage 1: execution sequence

### FOCUS-01 — Pause and classify (ChatGPT; Umayr confirms his side)
Persist this decision and classification in the existing registry. Stop accessible non-focus automation. Umayr inventories his running sessions, schedules and jobs, pauses non-focus work at a safe checkpoint, and returns IDs/state evidence. Do not kill shared infrastructure serving the two active products. Unknown platform/project mappings remain blocked for execution.
Acceptance: exactly the two product workstreams active; every exception identifies an approved dependency; no claims beyond controlled surfaces.

### LAB-01 — Activate the existing client journey (Umayr implementation; ChatGPT acceptance)
Preserve the approved Lab UI and D1 business records. Verify the published version's source provenance and explicit owner/admin identity first. Audit Supabase auth configuration and its isolation from AMAN before any auth setting change. Verify signup, confirmation, login, recovery and client/staff/admin separation with separate test accounts. Verify SMTP and callback URLs. Review each API route for safe public exposure before changing owner-only hosting. Enable client access only after the access tests pass.
Existing prices/terms are not newly approved by this plan. Payments remain sandbox-only until commercial identity, terms and actual payment workflow are approved and tested. Provider credentials enter hosting secret storage only. Existing OpenAI code does not authorize changing the owner's AI-provider strategy or buying a new subscription.
Acceptance: client A submits a real test brief, client B cannot read it, owner sees it, staff see assigned scope, and the client can track and accept a delivery. Payment and AI readiness are separately evidenced, not prerequisites for falsely claiming the whole site ready.

### OFFICE-01 — Redesign the existing Office interface (ChatGPT design; Umayr integration)
Use the current AMAN brand: graphite, warm ivory and restrained gold; Arabic-first RTL and mobile-first. Preserve existing auth, approval, jobs and audit logic. Identify which surface the owner will use (Claude Artifact versus repository web UI) before implementation.
The home screen prioritizes: (1) decisions awaiting Aman with amount/recipient/impact and approve/reject, (2) work in progress with responsible actor and last evidence, (3) new Lab requests awaiting classification, (4) failures with a clear recovery action, (5) recent verified outcomes. A compact persistent command field accepts typed/voice input only where runtime is verified.
Navigation: Today, Work, Approvals, Mail & Documents, Connections. On phones use a short bottom navigation and accessible drawers; desktop uses a calm side rail. Use progressive detail rather than decorative agent maps. Label configured agents separately from workers that have executed. Use timestamps and fresh/stale/error states; never green status merely because a count query passed. Every action points to a real existing route or is visibly unavailable.
Acceptance: owner can find the next decision in one screen, open a case and inspect source-to-action history, approve/reject with a clear sender, and identify a blocked connection. Verify 375/768/1440 layouts, keyboard/focus, contrast and all important buttons. No synthetic customer counts presented as live.

### LINK-01 — One governed Lab-to-Office flow
Lab owns clients, briefs, commercial scope and client-visible delivery status. Office owns executive cases, approvals, execution jobs and internal audit. GitHub owns engineering issues/PRs/commits. Claude owns bounded engineering execution, not another business database.
Proposed interface is explicit, versioned and server-to-server. Events contain event_id, event_version, project_id, work_id, source_request_id, tenant mapping, actor, timestamp and minimal approved payload. Use signed requests or scoped service authentication, replay protection and idempotency on the receiver. Tenant mappings are server-owned; reject unknown projects and paused/demo execution. Never share service-role secrets or perform cross-database joins.
A Lab request creates at most one Office case and, when classified as actual and approved for engineering, one GitHub work item. PR evidence returns to Office for ChatGPT acceptance. Only approved client-safe status/delivery information returns to Lab. No automatic merge, public publish or client message merely because Claude says done.
Acceptance: duplicate submission/event produces one case/job; unknown tenant denied; paused/demo project cannot trigger paid work; dependency failure preserves the task; internal notes/secrets never reach client UI; a verified delivery completes the original request.

### PLATFORM-01 — Register and verify existing platform connections
Inventory current connections and necessity before enabling them. GitHub: engineering evidence; Sites: current Lab hosting; AMAN Supabase: Office data/runtime; Lab D1: customer work; Lab Auth: verify actual project boundary; Vercel: verify current Office deployment; Gmail/Zoho: governed mail; VoiceStudio: trusted host loopback only; Stripe: sandbox verification when commercially needed. Additional platforms require a named purpose, scoped permissions, cost and test evidence. “All platforms” is an inventory objective, not blanket data sharing.

## Delivery and ownership
ChatGPT prepares Stage 1 and acceptance; Umayr reviews, implements through branch/tests/PR, then returns the evidence here. Use the existing partnership contract. Link Office work to issue #21; link cross-product coordination to this focus record. One implementer per WORK_ID.

Each handoff includes DONE / TESTED / FAILED / BLOCKED / COST IMPACT / NEXT, PR/commit, exact environment, cross-project impact and rollback. Finish each stage before expanding scope. Do not claim automatic synchronization between chat sessions.
