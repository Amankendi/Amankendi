# Project Isolation Standard

## Objective

Maintain **zero unapproved overlap or conflict** between distinct projects.

This does not mean projects can never reuse the same public library, engineering standard or approved shared utility. It means no project may silently own, mutate, depend on, or expose another project's business truth or private runtime resources.

## Isolation dimensions

Each independent project should have explicitly declared ownership for:

1. GitHub repository / source of truth
2. database and schema ownership
3. authentication tenant / authorization model
4. storage buckets and file namespaces
5. secrets and service credentials
6. deployment/project IDs
7. domains and callback URLs
8. queues, cron jobs and workers
9. payment/webhook endpoints
10. analytics identifiers
11. AI memory/context stores
12. logs/audit data
13. customer/tenant data
14. environment variables

A shared resource is prohibited unless it is listed as an approved shared resource with:
- owner
- purpose
- allowed projects
- access mode
- data classes allowed
- failure boundary
- security controls
- version/interface contract

## Hard anti-overlap rules

- A project must not read another project's private tables because they happen to share a Supabase project.
- A project must not reuse another project's service-role/API secrets.
- A project must not write into another project's storage namespace.
- A project must not share production callback URLs or webhooks accidentally.
- A project must not use another project's memory/vector store for convenience.
- A project must not place unrelated product code into an existing repository just to avoid creating a new system.
- A shared library must not become a hidden database or business-rule owner.
- Cross-project imports must be explicit and stable; circular project dependencies are forbidden.

## Routing test

Treat work as an **independent system** when two or more are true:
- distinct customers/users;
- distinct business owner or brand;
- distinct data lifecycle;
- distinct legal/privacy purpose;
- independent deployment/release cycle;
- independent billing;
- independent domain;
- failure should not bring down the other product;
- it can reasonably be sold/transferred/deployed independently.

Independent system => separate repository and runtime boundary.

## Pre-merge boundary gate

Before merge answer:
- Which PROJECT_ID owns this?
- Is there exactly one system-of-record repository?
- What data/resources are touched?
- Are any touched resources owned by another project?
- If shared, is the share explicitly registered?
- Does this create a second source of truth?
- Can this change be rolled back without changing another independent project?

Any unacceptable answer => `BOUNDARY_BLOCKED`.

## Registry

`config/project-registry.json` is the machine-readable starting registry.
Unknown legacy repositories remain `classification_required` until reviewed; lack of classification is not permission to mix them.
