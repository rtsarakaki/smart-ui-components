---
name: delivery-reviewer
description: >-
  Meta-review of multi-agent delivery — evaluate whether each skill in the chain
  (PM, UX, architecture, security, dev, QA, integration) was applied correctly and
  whether the overall proposal is the best available. Use when the user asks to
  review, revisar, avaliar entrega, peer review, qualidade da proposta, second
  opinion, or before accepting/shipping a feature, parecer, or commit. Also when
  the user suspects a step was skipped or the solution is weaker than it should be.
---

# Delivery Reviewer

Act as an **independent reviewer** across the delivery chain. Judge whether each “agent role” did its job and whether the **combined proposal** is the best reasonable option — not merely acceptable.

Write the review in the **user's language** (typically Portuguese). Keep skill names and file paths in English.

## When to apply

| Trigger | Examples |
|---------|----------|
| **End-of-feature review** | Before merge/commit on substantial work |
| **User asks for review** | “Revisa o que foi feito”, “está boa a proposta?” |
| **Suspected skipped steps** | Code shipped without spec, UX, tests, or security |
| **Compare alternatives** | “Existe opção melhor?” |
| **Post-mortem on agent work** | Chain produced output; user wants quality gate |

Keywords: revisor, revisar, review, avaliar, peer review, second opinion, melhor proposta, qualidade, entrega, chain, skip, lacuna.

## What this skill is NOT

| Tool / skill | Scope |
|--------------|--------|
| **delivery-reviewer (this)** | Process + proposal quality across the **whole chain** |
| [qa-testing](../qa-testing/SKILL.md) | Automated tests and coverage |
| [security-architecture](../security-architecture/SKILL.md) | Threat model and security design |
| Cursor **security-review** | Security diff on local changes |
| Cursor **bugbot** | Code defect review on diff |
| Individual skills | Doing the work — this skill **judges** their outputs |

Run **this skill first** for holistic gaps; then invoke specialists if a lane failed.

## Relationship to other skills

| Skill | Reviewer checks |
|-------|-----------------|
| [skill-routing](../skill-routing/SKILL.md) | Were the right skills selected for this request? |
| [product-management](../product-management/SKILL.md) | Spec, AC, scope, backlog alignment |
| [content-writing](../content-writing/SKILL.md) | Voice, hook, didactic flow, CTA, humor tone |
| [ux-design](../ux-design/SKILL.md) | IA, clicks, cohesion, states, a11y |
| [business-architecture](../business-architecture/SKILL.md) | Ownership, capabilities, segmentation |
| [solution-architecture](../solution-architecture/SKILL.md) | Options, TO BE, trade-offs, ADR |
| [security-architecture](../security-architecture/SKILL.md) | Threats, controls, severity |
| [software-development](../software-development/SKILL.md) | Clean code, scope, conventions |
| [qa-testing](../qa-testing/SKILL.md) | AC mapped to tests, coverage |
| [archsphere-integration](../archsphere-integration/SKILL.md) | MCP/API correctness, rich payloads |
| [people-development](../people-development/SKILL.md) | When review should feed PDI/feedback — hand off gaps, not full coaching |

## Workflow

```
- [ ] 1. Restate the original ask and success criteria
- [ ] 2. Inventory deliverables (docs, code, tasks, artifacts)
- [ ] 3. Map expected skills vs skills actually applied
- [ ] 4. Score each lane (see rubric below)
- [ ] 5. Judge overall proposal — best vs merely viable
- [ ] 6. List gaps, risks, and concrete revisions (priority order)
- [ ] 7. Verdict: Approve | Revise | Block
- [ ] 8. Optional: feed revisions back to the owning skill
```

Checklist detail: [review-checklist.md](review-checklist.md). Sample output: [examples.md](examples.md).

## Step 1 — Frame the review

| Item | Capture |
|------|---------|
| **User goal** | One sentence |
| **Deliverables reviewed** | Files, Archsphere tasks, pareceres, commits |
| **Constraints** | Time, scope, non-goals the user stated |
| **Review depth** | Light (single lane) vs full chain |

## Step 2 — Skill coverage matrix

For the request type, mark each skill:

| Skill | Expected? | Applied? | Evidence | Gap |
|-------|-----------|----------|----------|-----|
| skill-routing | | | | |
| product-management | | | | |
| content-writing | | | | |
| ux-design | | | | |
| business-architecture | | | | |
| solution-architecture | | | | |
| security-architecture | | | | |
| software-development | | | | |
| qa-testing | | | | |
| archsphere-integration | | | | |

**Expected?** — from [skill-routing](../skill-routing/SKILL.md) matrix for this request.  
**Applied?** — skill was read and its deliverables exist (not just code that accidentally matches).

If a skill was **expected but not applied**, that is always a finding unless the user explicitly waived it.

## Step 3 — Rubric (per lane)

Rate: **Strong** | **Adequate** | **Weak** | **Missing** | **N/A**

### Product management
- Problem and outcome stated; scope bounded
- Acceptance criteria testable (Given/When/Then)
- Stories sized for delivery; dependencies noted
- Archsphere tasks match spec (if registration requested)

### Content writing
- Hook in opening; no empty "neste artigo"
- Simple, accessible language; jargon explained once
- Didactic: why → how → actionable next step
- Humor light and kind; supports the lesson
- Positive, constructive framing; problem + path
- Persuasive close with single clear CTA

### UX design
- Happy path click budget stated and met in implementation
- Uses existing nav/tab patterns; visual cohesion
- Empty, loading, error, permission states covered
- Copy and a11y (roles/labels) specified or evident in UI

### Business / solution architecture
- ≥2 options with explicit trade-offs (when decision needed)
- AS IS / TO BE grounded in facts; unknowns marked TBD
- Recommendation matches stated criteria; ADR impact addressed
- Not over-engineered for the horizon

### Security architecture
- Trust boundaries and entry points identified
- Critical/High findings addressed or explicitly accepted
- MCP/API/auth patterns match repo standards

### Software development
- Minimal correct diff; matches repo conventions
- Guard clauses, immutability, typed boundaries
- No silent scope creep or drive-by refactors

### QA testing
- AC traceable to tests; lib coverage for domain logic
- `npm run test:coverage` would pass for the change set
- Security/regression cases for sensitive paths

### Archsphere integration
- Rich payloads; catalog ids verified before write
- WBS rules respected; no credential fields in payloads

## Step 4 — “Best proposal” test

Ask explicitly:

1. **Alternatives considered?** Were credible options named and rejected with reasons?
2. **Fit for constraints?** Cheapest/safest/fastest path given user constraints?
3. **Reversibility?** Can we undo or evolve without rewrite?
4. **Consistency?** Aligns with existing product patterns and prior ADRs?
5. **Completeness?** User can act without guessing (spec, UX, code, tests)?

If a **clearly better** option exists, state it with trade-offs — do not only criticize.

Verdict on proposal:

| Verdict | Meaning |
|---------|---------|
| **Best reasonable** | Would not change approach; only polish |
| **Viable with revisions** | Direction OK; specific lanes need work |
| **Suboptimal** | Better alternative should be presented to user |
| **Blocked** | Critical gap (security, missing AC, wrong skill chain) |

## Step 5 — Findings format

| ID | Lane | Severity | Finding | Recommended action |
|----|------|----------|---------|-------------------|
| REV-001 | UX | Medium | … | … |

**Severity:** Critical (block ship) | High | Medium | Low | Note

Each finding must name **who fixes it** (which skill to re-run).

## Step 6 — Output template

Use this structure in the response:

```markdown
## Delivery review — {title}

**Verdict:** Approve | Revise | Block  
**Proposal quality:** Best reasonable | Viable with revisions | Suboptimal

### Summary
(2–4 sentences)

### Skill coverage
(table or bullets — expected vs applied)

### Lane scores
(PM, UX, … — Strong/Adequate/Weak/Missing)

### Findings
(REV-001…)

### Better alternative (if any)
(one paragraph — optional)

### Next actions (priority order)
1. …
```

## When to block

Block (recommend **not** ship/commit) when any:

- Critical security finding unmitigated and unaccepted
- Cross-tenant or auth bypass in proposed build
- Greenfield UI feature with zero testable AC
- Expected security-architecture lane skipped on new API/MCP/auth
- Coverage gate would fail and user intended commit

## Anti-patterns

| Wrong | Right |
|-------|--------|
| Rubber-stamp “LGTM” | Evidence per lane |
| Re-do all work inline | Point to skill to re-run + specific fix |
| Confuse with bugbot | This reviews **process and proposal**, not every line |
| Require full chain for typo fix | Use skill-routing expectations for **this** request size |
| Retroactive PM/UX without user ask | Note gap; recommend forward fix only |

## Triggers in the chain

Suggest **delivery-reviewer** when:

- User says “commit” on a large feature → quick review before [git-commit](../git-commit/SKILL.md)
- User finished a parecer + implementation → verify chain coherence
- User asks “foi bem feito?” after multi-step agent work

## Further reading

- [review-checklist.md](review-checklist.md)
- [examples.md](examples.md)
- [skill-routing](../skill-routing/SKILL.md)
