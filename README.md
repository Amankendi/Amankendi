# ALKENDI Work System

Canonical operating entry point for AMAN / ALKENDI projects.

**Conversation is the intake and decision space. GitHub is the durable engineering source of truth.**

## Precision doctrine

> **عبدالرحمن الكندي لا يساوم في الدقة.**
>
> Accuracy is a release requirement, not a writing preference.

Every agent, reviewer, developer and partner must distinguish:
- verified fact
- assumption
- proposal
- implementation
- test evidence
- production reality

Never report a proposal as implemented or code as working before appropriate verification.

## Core partnership

1. **ChatGPT / AMAN** builds Stage 1: requirement interpretation, boundary classification, first architecture/specification, risks, acceptance criteria and—when useful—an initial implementation.
2. **Claude / Umayr** reviews Stage 1, challenges gaps, engineers the implementation structure, and records code/PRs in the correct GitHub repository.
3. **ChatGPT / AMAN** performs acceptance and integration review against the original intent, project boundaries, security, cost and test evidence.
4. If the work belongs to an existing project, it stays in that project's repository.
5. If it is an independent product/system, it must receive its own repository, data boundary, secrets, deployment and lifecycle before production implementation.
6. Shared utilities may be reused only through explicit interfaces. Business truth/data must not silently cross project boundaries.

Read:
- `docs/00_AMAN_PRODUCT_BUILD_STANDARD.md`
- `docs/01_ALKENDI_WORK_SYSTEM.md`
- `docs/02_PROJECT_ISOLATION_STANDARD.md`
- `docs/03_CHATGPT_CLAUDE_PARTNERSHIP.md`
- `config/project-registry.json`

The validator `scripts/validate-project-registry.mjs` enforces declared project/resource isolation.
