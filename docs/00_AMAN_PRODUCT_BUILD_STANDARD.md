# AMAN Product Build Standard

**Version:** 1.0  
**Status:** Canonical global source  
**Owner:** AMAN / ALKENDI  
**Effective date:** 2026-10-06  
**Applies to:** All software, platform, website, AI-agent, automation, internal-tool, client-delivery, and experimental product repositories managed under AMAN / ALKENDI.

## Canonical reference

This standard was established from the ChatGPT conversation with AMAN on **2026-10-06**, beginning from the reference pattern shown in the “Anthropic designer (ex. Apple)” product/build specification and then adapted into an AMAN-wide engineering and product operating standard.

This file is the repository-level source derived from that conversation.

**Precedence rule:**

1. Safety, legal, security, and data-protection requirements.
2. This `AMAN Product Build Standard`.
3. The repository’s `PROJECT_MASTER_SPEC`.
4. The current `PRODUCT_BASELINE`.
5. The current `CURRENT_SPRINT`.
6. Individual implementation notes.

A project-specific specification may extend this standard, but must not silently weaken security, testing, data integrity, authorization, accessibility, privacy, or quality requirements.

---

## 1. Product philosophy

Build products that are useful before they are impressive.

Every feature must answer at least one of these questions:

- What user problem does this solve?
- What business outcome does this improve?
- What operational burden does this remove?
- What decision does this make faster or better?
- What risk does this reduce?
- What measurable value does this create?

Do not add functionality merely because it is technically possible.

Avoid fake dashboards, fake data, fake integrations, fake AI capability, placeholder actions presented as working, duplicated features, conflicting business rules, and hidden manual work presented as automation.

If a capability is incomplete, label it clearly as WORKING, PARTIAL, EXPERIMENTAL, BLOCKED, COMING SOON, or NOT IMPLEMENTED.

Never present unfinished work as complete.

## 2. Source-of-truth structure

Every significant project should converge toward:

```
docs/
  00_AMAN_PRODUCT_BUILD_STANDARD.md
  01_PROJECT_MASTER_SPEC.md
  02_PRODUCT_BASELINE.md
  03_BRAND_DESIGN_SYSTEM.md
  04_TECH_ARCHITECTURE.md
  05_DATABASE_AND_PERMISSIONS.md
  06_DECISIONS_LOG.md
  07_ROADMAP.md
  08_CURRENT_SPRINT.md
```

GLOBAL STANDARD defines how AMAN products are built. PROJECT MASTER SPEC defines what the specific product is. PRODUCT BASELINE describes verified current reality. CURRENT SPRINT defines what is being built now.

Agents and developers must not repeatedly reinterpret the whole product when only the current sprint changed.

## 3. Audit before rebuild

Before changing an existing product inspect the current stack, routes, screens, components, data model, authentication, roles, APIs, integrations, environment-variable names, deployment configuration, duplicates, conflicting rules, broken functionality, working functionality worth preserving, security/privacy risks, and blocking technical debt.

Default strategy:

```
PRESERVE good work
REMOVE duplication
RESOLVE contradictions
SIMPLIFY architecture
COMPLETE missing systems
TEST the result
```

Do not rebuild working systems simply because rebuilding is easier.

## 4. Execution behavior for AI coding agents

When the specification makes a decision obvious, implement it.

Ask for clarification only when there are materially different business outcomes, external credentials/authorization are required, a destructive action needs approval, legal/compliance meaning is unclear, or the project owner must choose between mutually exclusive directions.

Do not invent facts, credentials, APIs, vendors, customers, case studies, pricing, legal status, production readiness, or test results.

At the end of each implementation cycle report:

```
DONE
TESTED
FAILED
BLOCKED
NEXT
```

Include evidence when available.

## 5. Architecture principles

Prefer simple, modular, maintainable systems with clear separation between UI, business logic, data access, and integrations; typed interfaces where supported; reusable components without premature abstraction; explicit state ownership; consistent naming; reproducible builds; migrations; configuration through environment variables; provider abstractions; and no critical business logic hidden only in UI components.

Avoid giant components, duplicated business rules, circular dependencies, hardcoded production values, hidden global state, unjustified vendor lock-in, and direct browser access to privileged services.

## 6. Data model

Use a relational database when the product has meaningful relationships, permissions, transactions, projects, users, orders, clients, or operational state. Supabase/PostgreSQL is the preferred default when it fits, but is not mandatory when the existing architecture has a better justified choice.

Use primary keys, foreign keys, constraints, uniqueness rules, timestamps, intentional deletion behavior, migrations, and recorded state transitions. Avoid duplicated business truth.

Never rely on frontend filtering as a data-security mechanism.

## 7. Authentication and authorization

Authentication answers who the user is. Authorization answers what they may do. Both are required.

Use role-based and, when needed, resource-based permissions. For Supabase, use RLS where appropriate.

Critical rule: User A must not access User B’s private data by changing a URL, identifier, request, or frontend state.

Enforce authorization server-side and/or database-side.

## 8. Security and secrets

Security is part of the product definition.

Never store real secrets in source code, Git history, screenshots, prompts, README examples, browser-exposed variables, or frontend bundles.

Repository documentation may contain variable names only. Real values belong in protected secret storage.

If a secret is exposed, rotate it.

Use server-side validation, secure sessions, rate limiting, upload validation, file access rules, CSRF protection where relevant, audit logs for sensitive actions, least-privilege credentials, safe production errors, dependency review, and HTTPS in production.

## 9. Privacy and GDPR

Where applicable provide privacy policy, legal notice, cookie policy, consent management, data export, account deletion, retention rules, and lawful personal-data handling.

Do not enable non-essential tracking before legally required consent. Store consent version and timestamp where appropriate. Collect only data with a defined purpose.

## 10. AI systems and agents

Each AI agent must define identity, objective, inputs, allowed data, capabilities, limitations, tools/integrations, outputs, approval requirements, logging, cost controls, version, and status.

Recommended statuses: prototype, testing, active, paused, retired.

High-impact actions such as external communication, publishing, deletion, financial transactions, contractual actions, permission changes, production infrastructure changes, or confidential-data release should require explicit authorization where appropriate.

## 11. AI cost and token governance

Every paid AI call should be attributable where feasible by user, project, agent, provider, model, timestamp, input/output usage, estimated cost, and success/failure.

Use budgets by request, user, project, agent, day, and month where appropriate.

Route simple extraction/formatting/classification to economical models; routine generation to standard models; difficult strategy/architecture/analysis to stronger reasoning models.

Do not send entire histories when a small context subset is enough. Use retrieval, context selection, summarization, prompt versioning, caching where safe, and deterministic preprocessing where AI is unnecessary.

Target: **maximum useful intelligence per euro and per token.**

## 12. Integrations

Treat external systems as replaceable modules when practical: email, calendar, CRM, payments, shipping, storage, AI, analytics, messaging, automation, maps/geolocation.

Do not scatter one vendor SDK across the codebase when a clean adapter can isolate it.

Never claim an integration works until a real or appropriate sandbox end-to-end path has been tested.

## 13. Email architecture

Do not make a founder’s personal inbox the permanent public identity of a business system. Prefer role-based addresses such as info@, support@, projects@, billing@, and notifications@.

Use SPF, DKIM and DMARC for custom domains. Separate public identity, automated system mail, transactional mail, and internal administration. Verify DNS before declaring configuration complete.

## 14. UX and design quality

Use clear hierarchy, consistent spacing and typography, coherent components, predictable navigation, visible system status, useful empty/error/loading states, and meaningful CTAs.

Avoid random effects, excessive gradients/glassmorphism, meaningless motion, stock imagery that weakens credibility, duplicate styling, tiny “premium” text, and compressed-desktop mobile layouts.

Interactive controls should define relevant states: default, hover, focus, active, disabled, loading, error.

## 15. Motion

Motion must explain hierarchy, transition, state, relationship, progress, or feedback. Do not animate everything. Respect `prefers-reduced-motion`. Performance and usability outrank decoration.

## 16. Responsive behavior

Test intentionally around 375px, 768px, 1024px, and 1440px+. Avoid horizontal overflow. Navigation, forms, media, dashboards, modals, tables, and agent interfaces must be usable on small screens when mobile support is claimed.

## 17. Internationalization

If multilingual, internationalization must be architectural. Support RTL/LTR correctly. Do not hardcode language strings throughout components. Allow independent content per language where market meaning differs. Test Arabic independently.

## 18. Accessibility

Target WCAG 2.2 AA where reasonably achievable. Use semantic HTML, keyboard navigation, visible focus, labels, sufficient contrast, alt text, accessible form errors, and screen-reader status where needed. Do not convey critical information only through color, hover, or animation.

## 19. Performance

Optimize images, fonts, JavaScript, network calls, third-party libraries, caching, and rendering strategy. Lazy-load non-critical assets. Avoid loading heavy decoration before core content. Aim for healthy Core Web Vitals for public web products.

## 20. SEO and discoverability

Where relevant implement unique metadata, canonical URLs, Open Graph, social cards, robots.txt, sitemap, structured data, and hreflang. Do not reuse one generic title and description across every page.

## 21. Analytics

Measure outcomes, not only visits: signup, lead submission, purchase, booking, checkout, project request, agent use, service interest, abandonment, and conversion by source. Respect privacy.

## 22. Error handling

Never expose blank screens, raw stack traces, database dumps, secret values, provider internals, or silent failures.

Async flows should account for loading, success, empty, error, and retry. Preserve user-entered form data after recoverable failures. Log technical details safely.

## 23. Environments

Use LOCAL, DEVELOPMENT, PREVIEW/STAGING, and PRODUCTION as maturity requires. Production secrets must not be casually reused in development. Use preview deployments before major releases when possible. Never overwrite production unintentionally.

## 24. Repository hygiene

Keep README, setup, purpose, dependencies, migrations, architecture decisions, and generated assets understandable. No committed secrets, unexplained junk, duplicate abandoned source trees, or unused components where safe to remove. Use meaningful commits.

Do not silently delete working product history merely to create a clean rewrite.

## 25. Testing

Validate behavior, not screenshots alone. Depending on the project verify production build, routing, authentication, authorization, database rules, forms, API failure paths, payments in sandbox, emails, uploads, multilingual layout, mobile navigation, critical journeys, admin restrictions, cross-user isolation, agent approval boundaries, analytics, and production configuration.

For every failed test:

```
identify -> fix -> rerun -> record
```

Do not replace testing with “should work”.

## 26. Quality gate

Before declaring release-ready ensure there are no dead buttons, fake forms, working links pointing to #, unresolved critical console errors, exposed secrets, unauthorized cross-account access, contradictory product rules, hidden placeholders, unsupported production claims, critical mobile breakage, or undocumented P0/P1 bugs.

Document known limitations explicitly.

## 27. Definition of Done

A feature is done only when implementation exists, primary path works, failure path is handled, authorization is correct, responsive behavior is acceptable where relevant, risk-appropriate tests pass, no secret was exposed, documentation is updated, limitations are stated, and another developer/agent can reproduce it.

“Code written” is not the same as “done”.

## 28. Delivery status language

Use DONE, TESTED, FAILED, BLOCKED, NEXT consistently. Do not hide FAILED or BLOCKED items to make progress appear better.

## 29. Change control

Record major decisions in `06_DECISIONS_LOG.md` with date, decision, reason, alternatives, impact, and owner.

A later agent should not reverse an intentional decision merely because it prefers another implementation.

## 30. Project-specific extension rule

Each project keeps its business truth in `01_PROJECT_MASTER_SPEC.md`: product name, users, pricing, services, workflows, roles, business rules, project data model, design identity, integrations, and launch scope.

Do not put one project’s special rules into this global standard.

## 31. Current-sprint discipline

`08_CURRENT_SPRINT.md` should define sprint goal, in-scope, out-of-scope, acceptance criteria, dependencies, test plan, and completion status.

This prevents agents from attempting to rebuild the whole product on every task.

## 32. Final operating rule

The purpose of this standard is to make execution clearer, safer, faster, cheaper, more testable, easier to hand off, and less dependent on one model, tool, developer, or conversation.

When documentation and implementation disagree, verify the real system, record the discrepancy, and repair the source of truth.

---

## Repository adoption record

When this file is added to a repository, that repository adopts **AMAN Product Build Standard v1.0** until superseded by a newer version.

**Canonical origin:** ChatGPT conversation with AMAN, 2026-10-06.  
**Reference theme:** “Anthropic designer (ex. Apple)” specification pattern -> AMAN-wide product build system.
