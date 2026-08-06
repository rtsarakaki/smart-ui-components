# Examples

Two patterns: **greenfield** (any new project) and **dispute** (ownership/ADR). Re-validate facts every time — do not copy conclusions.

---

## A — New implementation (greenfield)

### Frame

| Item | Example |
|------|---------|
| Decision | How to deliver capability X for domain Y |
| Outcome | Reduce manual ops; single source of truth for Z |
| Constraints | Must go live in 6 months; reuse existing auth |
| Non-goals | Multi-region; full legacy decommission |

### Options archetypes

| Option | Summary |
|--------|---------|
| A — Extend legacy | Fastest; increases coupling to system L |
| B — New microservice in domain Y | Clean boundary; domain owns run |
| C — Shared platform module | Reuse across domains; needs platform PO |
| D — Buy SaaS | Fast; integration + data residency risk |

### Recommendation pattern

Recommend **C phased**: platform API v1 for domain Y in Q3, second consumer in Q4 after SLA proof — balances reuse without big-bang centralization.

### Parecer must include

- TO BE diagram (logical)
- Comparison table (section 6 of template)
- Explicit **decisions for the user** (budget owner, build vs buy sign-off)

---

## B — Ownership dispute (duration / pricing)

### Frame

| Item | Example |
|------|---------|
| Decision | Who provides duration to Corretora |
| Historical ADR | IS provides duration (~1 year ago) |
| Legacy tool | **SAC** — **is** IS pricing today (contracted); decommission planned |
| Transition | Corretora **stopped using SAC** → lost duration; IS pricing **still is SAC** until migration to **new piece** |
| Custody | **Corretora custody** and **IS custody** are separate books |
| Conflict | IS: duration is pricing output; cannot honor ADR for Corretora until post-SAC replacement exists |
| Segmentation | Private (feeders) vs public (data on asset) |

### Options

| Option | Summary |
|--------|---------|
| A — Honor ADR | IS provides all duration |
| B — Fully distributed | Each custodian calculates |
| C — Segmented | IS for feeder-backed pricing path; local for public |

### Recommendation pattern

Revise ADR; **segmented ownership** by data dependency (see SKILL heuristics).

### Parecer must include

- Capability vs calculation distinction
- **Legacy decommission context** (SAC or equivalent): who migrated off, who still depends, migration gap
- ADR action: revisar/substituir
- Workshop with named stakeholders

---

## C — Integration / build vs consume

### Frame

| Item | Example |
|------|---------|
| Decision | Build pricing engine vs consume IS API |
| Consumer | New distribution channel |
| Constraint | Must not duplicate feeder contracts |

### Options

| Option | Summary |
|--------|---------|
| A — Consume IS API | Lower build; dependency on IS roadmap |
| B — Local engine | Autonomy; duplicate models risk |
| C — Thin adapter + IS for private only | Hybrid |

Use when user asks about **new channel** or **new system** consuming existing domains.

---

## Quick checklist (any scenario)

- [ ] One clear **decision sentence** in section 1
- [ ] **Resumo em linguagem simples** at the top (readable without C4)
- [ ] **Glossário** for acronyms and technical terms
- [ ] ≥2 **viable** options with **Em uma frase** + pros/cons
- [ ] **Comparison table** across dimensions
- [ ] **Recommendation + o que muda na prática**
- [ ] **Decisions for the user** (section 8) — approvable in a meeting
- [ ] TBD list for missing facts
