# Architecture Decision — 2026-10-15 (binding)
WORK_ID: ALKENDI-STACK-20261015
STATUS: OWNER APPROVED — governs future proposals, agent handoffs, release plans and source changes. **Not evidence of a live deployment.**

## Product-by-product architecture (no automatic migration)

| Product | Repository | Current approved runtime | Data | Identity | Required action |
| --- | --- | --- | --- | --- | --- |
| ALKENDI LAB | `Amankendi/Alkendi-lab-` | **Cloudflare Workers** | **Cloudflare D1** | Existing dedicated **Supabase Auth only where application code requires it** | Continue current architecture; do not add Vercel, another application database, or duplicate gateway merely to save cents |
| AMAN Office | `Amankendi/aman-executive` | **Vercel** (retain while product acceptance remains incomplete; account deployment issues are separate) | **Supabase PostgreSQL** | **Supabase Auth** for Office only | Finish AuthGate/login, tenant authorization/RLS, background jobs, real backups/restore tests before contemplating any hosting migration |

Shared: engineering standards, APLC, signed audited integration protocols. **Not shared:** customer data, databases, secrets, authentication stores, service-role keys, background-task queues or arbitrary privileged network channels. Keep signed LAB↔Office bridge disabled until audited integration acceptance. No cross-product resource consolidation for marginal savings.

## Superseded instructions — do not execute
1. Any earlier order to *force* migration of AMAN Office from Vercel to Cloudflare is superseded. Historic Worker deployment workflows must remain incapable of publishing Office while this decision stands; read-only research is allowed.
2. The earlier combined `alkendi.app` Cloudflare plan **must not make an Office Cloudflare Worker a prerequisite** for LAB deployment. LAB domain/DNS migration, if still desired, is a separately tested, owner-controlled change, preserving an Office Vercel DNS route when relevant.
3. Existing `alkendi.app` Vercel experimental routing/paused deployment is not an endorsed OFFICE architecture. Registration/DNS/HTTP service are different resources: never treat old apex experiments as grounds to move AMAN Office hosting.
4. Historical domain migration work items and snapshots are superseded *where they contradict this decision*. No automatic DNS, nameserver, hosted DB, credential, billing or production action follows from updating a decision.
5. **All other registered domains and their DNS, email, deployments and keys are out of scope.**

## Agent execution and precedence
For any conflict, apply: safety/security/legal → latest explicit owner architecture decision (this ADR) → project-specific approved baseline → earlier plans and exploratory docs. No agent may infer approvals from an old issue/PR, build-only CI, or stale release variable. Do not resurrect retired apps.

- AMAN (ChatGPT): source audit, acceptance evidence, coordinate issues/PRs.
- Umayr (Claude): review and implement within the correct repository, check code for contradictory workflows and failing test gates.
- Operational agents: use the repo product profile; no implicit provider migration, cross-tenant reads or external sends.
- Existing `AMAN Stack Architect` PRs: Office #61 and Lab #34 are complementary **governance proposals**, not proof they are merged or deployed.
- For cross-project drift, route a single WORK_ID through project issues, with one implementer/reviewer; keep unrelated repositories untouched.

## Release acceptance
LAB: Workers+D1 isolation, correct Auth, verified runtime test, error/cost bounds. Office: Vercel deployment continuity, real authentication, tenant RLS, durable jobs, approval policy and backups. Both: production proof and smoke checks must be supplied separately. CI, plans, GitHub merges or DNS configuration alone are **not** successful release evidence.

## Rollback
Revert architecture-alignment PRs if they break source checks; no user data migrations or provider operations occur from this ADR.
