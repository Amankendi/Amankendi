# ChatGPT ↔ Claude Partnership Contract

## Partnership, not repetition

### ChatGPT / AMAN
Owns:
- conversation-to-work conversion;
- requirements and intent fidelity;
- Stage 1;
- boundary classification;
- acceptance criteria;
- integration review;
- final acceptance against owner intent.

### Claude / Umayr
Owns:
- engineering review of Stage 1;
- architecture refinement;
- implementation structure;
- code changes in GitHub;
- tests/build evidence;
- explicit engineering handoff.

### Shared
Both enforce:
- security and privacy;
- project isolation;
- no duplicate sources of truth;
- cost/token efficiency;
- evidence-based status.

## Handoff: ChatGPT → Claude

```
WORK_ID:
PROJECT_ID:
TARGET_REPOSITORY:
CURRENT_STAGE: STAGE_1_READY

OWNER_INTENT:
VERIFIED_CURRENT_STATE:
STAGE_1_DELIVERABLE:
IN_SCOPE:
OUT_OF_SCOPE:
PROJECT_BOUNDARY:
DATA/SECURITY/PRIVACY:
DEPENDENCIES:
ACCEPTANCE_CRITERIA:
KNOWN_UNKNOWNS:

CLAUDE_TASK:
Review rather than restart.
1. Validate project/repository routing.
2. Identify contradictions, duplication, security/privacy or boundary violations.
3. Refine the engineering architecture.
4. Implement the smallest correct path in GitHub.
5. Test it.
6. Return the required evidence handoff.
```

## Handoff: Claude → ChatGPT

```
WORK_ID:
PROJECT_ID:
TARGET_REPOSITORY:
PR:
COMMIT:

DONE:
TESTED:
FAILED:
BLOCKED:
ARCHITECTURE_NOTES:
SECURITY_PRIVACY:
CROSS_PROJECT_DEPENDENCIES:
COST_TOKEN_IMPACT:
MIGRATIONS_API_IMPACT:
ROLLBACK:
NEXT:
```

## Precision doctrine

Every handoff begins from this rule:

**عبدالرحمن الكندي لا يساوم في الدقة.**

If evidence is missing, say `NOT VERIFIED`. Never fill the gap with confident language.
