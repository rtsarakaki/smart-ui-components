# Delivery reviewer — checklist

Quick reference when scoring each lane.

## Global (all reviews)

- [ ] Original user goal restated accurately
- [ ] Deliverables inventory complete (not just latest message)
- [ ] skill-routing matrix used to set **Expected?** column
- [ ] Findings are actionable and assigned to a skill
- [ ] Better alternative named when proposal is suboptimal

---

## Product management

| Check | Strong | Weak signal |
|-------|--------|-------------|
| Problem statement | Clear user/job outcome | Vague “implement X” |
| Scope | In/out of scope listed | Scope creep in dev |
| Acceptance criteria | Testable, numbered | Missing or subjective |
| Stories | Independent, sized | Epic disguised as one task |
| Archsphere | Tasks match spec | No tasks when registration expected |

---

## UX design

| Check | Strong | Weak signal |
|-------|--------|-------------|
| Click budget | Stated + met | Deep navigation for simple task |
| Patterns | Reuses project tabs/modals | New IA without reason |
| States | Empty, error, saving, denied | Happy path only |
| Visual | Cohesive with app | One-off styling |
| Spec exists | UX notes for dev | Dev guessed layout |

---

## Business architecture

| Check | Strong | Weak signal |
|-------|--------|-------------|
| Capabilities | Named, owned | Org chart prose only |
| Boundaries | Clear rules | Ambiguous “shared service” |
| Options | Centralize vs federate compared | Single forced answer |
| Segmentation | Rules explicit | One-size-fits-all |

---

## Solution architecture

| Check | Strong | Weak signal |
|-------|--------|-------------|
| AS IS | Evidence-based | Assumed systems |
| TO BE | Diagram or clear flows | Buzzwords |
| Options | ≥2 with pros/cons | Single option |
| NFRs | Latency, coupling, ops | Ignored |
| ADR | Impact stated | Contradicts ADR silently |

---

## Security architecture

| Check | Strong | Weak signal |
|-------|--------|-------------|
| Scope | Assets, actors, entry points | “Seems secure” |
| Threats | STRIDE on key flows | Generic OWASP list |
| Findings | Severity + mitigation | No Critical/High check |
| MCP/API | Injection, scope, redaction | User-controlled owner ids |
| Acceptance | Security AC for QA | No verify path |

---

## Content writing

| Check | Strong | Weak signal |
|-------|--------|-------------|
| Hook | Curiosity or story in first lines | "Neste artigo veremos…" |
| Voice | Simple, fluid, light | Jargon wall, corporate tone |
| Didactic | Why + how + action | Concept-only, no next step |
| Humor | Sparse, kind | Forced jokes, punch-down |
| Persuasion | Clear thesis + CTA | Weak ending, hidden ask |
| Constructive | Problem + path forward | Complaint-only |

---

## Software development

| Check | Strong | Weak signal |
|-------|--------|-------------|
| Scope | Minimal diff | Unrelated refactors |
| lib/ pure logic | Testable helpers | Logic in components |
| Style | Guard clauses, immutability | Nested if/else, mutation |
| Types | Strict, no `any` | Untyped boundaries |
| i18n | User strings in locale | Hardcoded UI copy |

---

## QA testing

| Check | Strong | Weak signal |
|-------|--------|-------------|
| AC traceability | Each AC → test | No tests for new lib |
| Layers | Unit + key component | Untested UI path |
| Coverage | Would pass 80% gate | Skipped run |
| Security tests | Auth deny, injection | Only happy path |
| Behavior asserts | Roles/labels | CSS class asserts |

---

## Archsphere integration

| Check | Strong | Weak signal |
|-------|--------|-------------|
| Catalog | Ids verified before write | Guessed UUIDs |
| Payloads | Rich, complete fields | Minimal one-liners |
| WBS | Coarse phases, child progress | Empty level-1 phases |
| Artifacts | Full markdown in WBS link | Logbook-only summary |
| Secrets | No keys in payload | Credential fields sent |

---

## Proposal quality (holistic)

| Question | Pass |
|----------|------|
| Would a staff engineer accept this without rework? | |
| Did we skip a skill the routing matrix requires? | |
| Is there an obvious simpler design? | |
| Can the user decide/act with what was delivered? | |
| Are risks explicit (not hidden in code)? | |

---

## Verdict guide

| Condition | Verdict |
|-----------|---------|
| All expected lanes Strong or Adequate; no Critical findings | **Approve** |
| Weak lanes but fixable; no Critical | **Revise** |
| Critical finding OR wrong approach OR skipped required skill on sensitive work | **Block** |
