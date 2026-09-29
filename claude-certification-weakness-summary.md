# Claude Certified Architect Foundations - Weakness Summary

## Current position

- Previous scaled score: **627**
- Passing scaled score: **720**
- Difference: **93 scaled points**
- Important: the scaled-score difference cannot be converted reliably into a number of questions without Anthropic's scoring formula.

## Highest-leverage study order

### 1. Enforced controls: hooks, permissions, and instructions

**Topic:** Decide whether a rule belongs in CLAUDE.md, settings permissions, PreToolUse, or PostToolUse.

**Why:** Several 0% objectives share the same missing distinction: guidance influences the model, while enforcement must happen outside model discretion.

**Reason:**

- CLAUDE.md and inline prompts describe desired behavior.
- Permissions prevent disallowed operations.
- PreToolUse validates or blocks an operation before it happens.
- PostToolUse checks or remediates after an operation, such as formatting or tests after an edit.

**Example:**

```text
“Follow our style guide”                -> CLAUDE.md
“Never write outside src/”              -> permission / PreToolUse
“Format every edited file automatically” -> PostToolUse
```

Evidence of mastery: given ten policies, classify each mechanism correctly and explain why a prompt alone is insufficient for the enforceable rules.

### 2. Terminal-state guarantees and structured handoffs

**Topic:** Ensure every agent run ends in a valid terminal state and preserves enough state for the next actor.

**Why:** Both orchestration safeguards and handoff packages scored 0%; these are central to reliable production agents.

**Reason:** Every exit path must resolve to either a completed result or an explicit escalation. A handoff needs more than conversation text: it must preserve the goal, evidence, work completed, open issues, authorization state, and exact next action.

**Example:**

```text
RUNNING
  |-- success ----------------------> COMPLETED
  |-- blocked / risk / retry limit -> HANDOFF_READY -> HUMAN

Invalid state: loop simply stops with no resolution owner.
```

Evidence of mastery: design a state machine whose timeout, tool failure, user escalation, and token-limit paths all end in `COMPLETED` or `HANDOFF_READY`.

### 3. Context placement and long-session exploration

**Topic:** Choose between inline context, `@` references, CLAUDE.md, targeted reads, scratchpads, and isolated subagents.

**Why:** Project-context selection scored 0%; codebase exploration and long-context management scored 50%.

**Reason:** Select the narrowest mechanism that matches the information's lifetime and audience.

**Example:**

```text
One request, highly specific       -> inline description
Existing file needed now           -> @ reference / targeted read
Reusable project-wide convention   -> CLAUDE.md
Path-specific reusable rule        -> .claude/rules/ with a glob
Long investigation state           -> scratchpad + targeted rereads
Independent context-heavy research -> isolated subagent
```

Evidence of mastery: justify the context mechanism for six scenarios without defaulting everything to CLAUDE.md.

### 4. Extraction schemas that represent uncertainty

**Topic:** Model missing and ambiguous data explicitly instead of forcing fabricated values.

**Why:** Schema design scored 0%, even though tool-based structured output scored 100%. The gap is schema semantics, not JSON mechanics.

**Reason:** Required fields force a value; optional fields allow absence; nullable fields encode a known field with no confident value; enums constrain valid categories. Preserve ambiguity rather than guessing.

**Example:**

```json
{
  "person_name": null,
  "candidate_names": ["Anne Smyth", "Anna Smith"],
  "date": "1912-03",
  "date_precision": "month",
  "review_required": true
}
```

Evidence of mastery: design a schema for noisy historical letters that distinguishes absent, unreadable, ambiguous, and confidently extracted values.

### 5. Tool selection and MCP integration

**Topic:** Make similar tools easy for an agent to distinguish and configure MCP correctly.

**Why:** Tool-description design scored 0%, while MCP integration/authentication scored 50%.

**Reason:** A useful tool description states when to use it, when not to use it, its exact input contract, examples, expected output, and how it differs from neighboring tools. Shared stable tooling normally belongs at project scope; personal experiments at user scope. Authentication should use environment-variable expansion and tool discovery must be verified.

**Example:**

```text
search_orders(customer_id, from_date, to_date)
Use when: finding multiple orders by customer and date range.
Do not use when: an exact order_id is known; use get_order instead.
Returns: summaries only; call get_order for line-item detail.
```

Evidence of mastery: rewrite three ambiguous tool descriptions and predict which tool an agent should select in five overlapping scenarios.

## Supporting priorities

- Human-review routing: 33% - route by confidence, document risk, and field-level ambiguity rather than random sampling.
- Iterative refinement: 50% - give concrete input/output examples, targeted failure feedback, and batched issues.
- Plan versus direct execution: 67% - prefer planning when work is broad, hard to reverse, architecturally uncertain, or requires stakeholder review.
- Dynamic decomposition: 75% - revise subtasks when findings change the problem instead of following a fixed checklist.
- Extraction accuracy: 75% - combine schema design, normalization rules, and representative few-shot examples.

## Recommended practice mix

- 30% orchestration safeguards, handoffs, and review routing
- 25% hooks, permissions, and configuration placement
- 15% context placement and efficient exploration
- 15% extraction schemas and ambiguity
- 10% tool descriptions and MCP integration
- 5% mixed retention of 100% objectives

## Readiness evidence

Use conservative practice thresholds rather than trying to predict the official scaled score:

- two consecutive fresh 60-question mocks at 80% or higher;
- no Priority A cluster below 75%;
- no broader domain below 70%;
- finish within 105 minutes, preserving 15 minutes for review;
- few high-confidence incorrect answers;
- explain the main architectural distinctions without seeing answer choices.
