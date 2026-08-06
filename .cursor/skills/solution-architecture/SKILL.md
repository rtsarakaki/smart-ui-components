---
name: solution-architecture
description: >-
  Produce a full architecture opinion (parecer) combining business context with
  solution design — AS IS/TO BE, integrations, NFRs, ADR impact, options and
  recommendation. Use when the user asks for parecer, insumos para decisão técnica,
  TO BE, build vs buy vs integrate, integration design, or a complete opinion after
  business boundaries are known. Deliverables must be clear to non-specialists and
  visually rich: C4, flowcharts, sequence/integration diagrams, option caixogramas
  — minimum 4 Mermaid diagrams per parecer. For capability maps, ownership, and
  operating model only, use business-architecture first.
---

# Solution Architecture (Parecer)

Produce a **parecer** with decision-grade inputs: context, options, trade-offs, recommendation, risks, and next steps. The user decides — the agent **does not** commit the organization to a path without presenting alternatives.

Applies to **any** implementation or architecture topic.

Write stakeholder-facing text in the **user's language** (typically Portuguese).

## Plain language (mandatory in every parecer)

A parecer is read in **comitês, superintendências, and workshops** where most participants are not architects. Structure for **two audiences in one document**:

| Audience | What they read |
|----------|----------------|
| **Leigos / gestores** | Resumo, glossário, “em uma frase” por opção, recomendação, o que muda na prática, decisões |
| **Arquitetos / engenharia** | C4, fluxos, comparativo técnico, NFRs, riscos |

Never require reading C4 to understand the recommendation.

### Required sections in the artifact

| Section | Purpose |
|---------|---------|
| **Resumo em linguagem simples** | Top of document: problema em 2 frases, opções em 1 linha cada, recomendação, principal trade-off |
| **Glossário** | Termos técnicos e siglas usados no parecer |
| **O que muda na prática** | Por área/sistema: comportamento AS IS vs TO BE em linguagem operacional |
| **Decisões para o solicitante** | Checkboxes with plain wording — approvable in a meeting |

### Writing rules

- Open section 1 with **“O que precisa ser decidido”** in one sentence a director can repeat aloud.
- Each **option**: mandatory **“Em uma frase”** before pros/cons; pros/cons in plain language.
- **Before** every Mermaid block, add a caption: *“Leitura do diagrama: …”* (one sentence).
- Separate **“Por que recomendamos X”** from technical proof — three bullets max in plain language, then detail.
- Say **what we are not doing** in plain language (avoids misinterpretation).
- Avoid passive voice that hides ownership (“deve ser provido”) — use **who** does **what**.
- **Visual-first:** the parecer must be navigable by diagram — a stakeholder who thinks visually should not need to read all prose to see AS IS, TO BE, integrations, and options.

### Tone

Decision-grade but accessible. The reader must be able to **defend the choice in a forum** without reading slides from architects line by line.

## Visual documentation (mandatory)

Every parecer must be **graphically rich** — fluxogramas, caixogramas (C4 Container/Context), sequências de integração, e deltas AS IS → TO BE. Text explains; **diagrams carry the architecture**.

### Minimum diagram set (deliver all that apply)

| # | Diagram type | When | Mermaid hint |
|---|--------------|------|--------------|
| S1 | **C4 Context AS IS** | S2–S4 (change/dispute) | `C4Context` |
| S2 | **C4 Container AS IS** | S2–S4 | `C4Container` |
| S3 | **C4 Context TO BE** | Always (incl. S1 greenfield) | `C4Context` |
| S4 | **C4 Container TO BE** | Always | `C4Container` |
| S5 | **Fluxo de integração / dados** | Any cross-system scope | `flowchart LR` or `sequenceDiagram` |
| S6 | **Fluxo de negócio ou jornada** | Handoffs, dispute, UX-adjacent | `flowchart TB` |
| S7 | **Delta AS IS → TO BE** | Migration, decommission, phased | side-by-side flowcharts or one diagram with dashed “remove” edges |
| S8 | **Opções arquiteturais** | Step 5 — one mini-caixograma per option | `flowchart` per option |
| S9 | **Deployment / runtime** *(optional)* | NFR, multi-region, SaaS | `flowchart` with runtime nodes |
| S10 | **Estado / lifecycle** *(optional)* | Workflow, state machine fields | `stateDiagram-v2` |

**Floor:** at least **4 Mermaid diagrams** in every parecer (typically S3+S4 + two of S5/S6/S8). **6+** for S2–S4 with legacy, integration, and ≥2 options.

Reuse [business-architecture](../business-architecture/SKILL.md) diagrams (capability map, value stream) in §3 — do not rewrite as bullets only.

### Caption rule

Before each diagram: *Leitura do diagrama: [uma frase].*  
In §7.1 “O que muda na prática”, reference diagrams by number (“ver Diagrama AS IS Container”).

### Visual quality rules

- **C4 is mandatory** for TO BE; AS IS C4 mandatory when landscape exists (S2–S4).
- **Flowcharts complement C4** — show message/event order and failure paths, not only static boxes.
- **Same naming** across C4, tables, and prose (system aliases, domain names).
- **Split** diagrams that exceed ~12 nodes — prefer linked Diagram 4a / 4b.
- **Options** must be visually comparable — same layout pattern per option caixograma.

### Anti-pattern: text-only parecer

Reject delivery if TO BE has no `C4Container`, or if the full document has fewer than **4** Mermaid blocks.

## Pair with business architecture

| Need | Skill |
|------|-------|
| Capability map, ownership, operating model, segmentation | [business-architecture](../business-architecture/SKILL.md) |
| Full parecer with systems, integration, TO BE, ADR | **This skill** |
| Security assessment of proposed TO BE | [security-architecture](../security-architecture/SKILL.md) after TO BE sketch |
| Both | Run business-architecture first, then this skill (reuse sections 3–8 of its assessment) |

If ownership is still unclear, **stop** and run business-architecture before recommending TO BE.

## When to apply

| Scenario | Examples |
|----------|----------|
| **New implementation / project** | New platform, API, migration, product feature |
| **Build vs buy vs integrate** | Internal build, vendor, reuse existing capability |
| **Ownership / boundary dispute** | Who provides capability, calculation, or data |
| **ADR review** | Confirm, revise, or supersede past decisions |
| **Transformation / evolution** | AS IS→TO BE, platôs, phased delivery |
| **Integration design** | ESB, sync/async, coupling between domains |

Triggers: parecer, insumos para decisão, analisar arquitetura, nova implementação, novo projeto, devo centralizar, build or buy, revisar ADR, arquitetura de solução, arquitetura de negócio.

## Scenario selection

At start, classify (can be more than one):

```
[ ] S1 — Greenfield / new initiative
[ ] S2 — Change to existing landscape (enhancement, migration)
[ ] S3 — Ownership or boundary dispute
[ ] S4 — ADR or past decision under challenge
```

Adapt depth: S1/S2 emphasize **TO BE and delivery**; S3/S4 emphasize **criteria and governance**.

## Workflow

```
- [ ] 1. Frame decision and success criteria
- [ ] 2. Gather facts and constraints
- [ ] 3. Business architecture view (+ reuse/import AN diagrams — capability, value stream)
- [ ] 4. Solution architecture view (AS IS / TO BE **C4 + fluxos S5/S6**)
- [ ] 5. Options (≥2) with trade-offs (+ mini-caixograma S8 por opção)
- [ ] 6. Recommendation and decision record
- [ ] 7. Parecer for the user (**resumo leigo + glossário + prática + ≥4 diagramas Mermaid**)
- [ ] 8. Optional: [security-architecture](../security-architecture/SKILL.md) if new auth/API/MCP/sensitive data
- [ ] 9. Optional: Archsphere project / logbook
- [ ] 10. Optional: embed or link in [design-doc](../design-doc/SKILL.md) when feature is part of a larger complex initiative
```

### Step 1 — Frame the decision

| Item | Question |
|------|----------|
| **Decision to make** | What must the user decide now (one sentence)? |
| **Business outcome** | Value, risk reduction, compliance, cost — why now? |
| **Stakeholders** | Requester, builder, consumers, governance |
| **Time horizon** | Tactical / structural / experimental |
| **Constraints** | Budget, deadline, regulation, legacy, skills |
| **Non-goals** | Explicitly out of scope |
| **Success criteria** | How we know the decision was right (3 bullets max) |

For disputes (S3/S4), also capture: historical decision, conflict, asset/context segmentation, **legacy tool decommission** (what the retiring tool provided, who stopped using it, who still depends).

If critical gaps remain, ask **one grouped message** (≤5 bullets).

### Step 2 — Gather facts

Evidence only — mark unknowns as `TBD`:

- Current **AS IS** (systems, teams, flows)
- **Data** sources, ownership, quality
- **Consumers** and coupling
- **ADRs**, prior studies, contracts
- **Legacy / vendor tools** being decommissioned — who already migrated off vs who still depends (e.g. contracted pricing package retired while internal consumers lag)
- **NFRs** mentioned: scale, latency, availability, audit
- **Archsphere** (MCP): related projects, logbook, WBS progress

Never invent system names, ADR text, or organizational structure.

### Step 3 — Business architecture view

Follow [business-architecture](../business-architecture/SKILL.md) steps 3–5 (capability map, value stream, ownership). In the parecer, summarize in section 3 — do not skip ownership even when the user asked only for "technical" opinion.

**BCM handoff:** reuse DE/MF/CB diagrams from business-architecture as-is (business language). **Technical detail** (APIs, vendors, `lib/` modules, NFRs) belongs in solution sections and maps to **Anexo A** from BA — do not rename CB boxes to REST/Stripe/MCP in §3.

**Carry forward visuals:** paste or reference the AN **capability map**, **value stream flowchart**, and **ownership/segmentation** diagram from business-architecture — section 3 must not be bullets-only when those diagrams already exist.

Minimum in parecer:

1. Capabilities in scope and type (core / support / calculation / shared / local)
2. Value stream placement and handoffs
3. Ownership + segmentation rules (table)
4. Operating model choice that constrains TO BE

### Step 4 — Solution architecture view

| Greenfield (S1) | Change / dispute (S2–S4) |
|-----------------|--------------------------|
| Problem statement + constraints | AS IS **C4 Context + Container** (S1, S2) |
| TO BE logical view (**C4 Context + Container** S3, S4) | Pain points / gaps |
| Integration & data flows (**S5** flowchart or sequence) | TO BE delta (**S7**) |
| Key NFRs | ADR / dependency impact |
| Business journey flow (**S6**) when multi-actor | AS IS integration flow (**S5**) |

**Diagramas:** Mermaid `C4Context` e `C4Container` are **required** for TO BE; AS IS C4 required for S2–S4. Flowcharts (`flowchart`, `sequenceDiagram`) **complement** C4 — show order, handoffs, and failure paths. **Component** (C4Component) only when workshop needs internal detail. In C4 `title` lines, avoid em dash and semicolon in free text — prefer ASCII hyphen.

**Quality gate before Step 7:** count Mermaid blocks ≥ 4; each has *Leitura do diagrama*; options section has ≥1 diagram per option or a shared comparativo (S8).

### Step 5 — Options (minimum two)

Each option must be **viable**, not a strawman.

**Option archetypes** (pick what fits):

| Archetype | When |
|-----------|------|
| **Status quo / extend** | Minimal change, accept known limits |
| **Centralize (platform)** | Single owner, SLA, economies of scale |
| **Distribute (domain-owned)** | Autonomy, data close to book/process |
| **Segmented / hybrid** | Different rules per context (asset, channel, team) |
| **Buy / partner** | Time-to-market, not core differentiator |
| **Integrate / consume** | Reuse existing internal capability |
| **Phased evolution** | Platôs with clear value per stage |

Per option document:

| Field | Content |
|-------|---------|
| Name | Short label |
| **Em uma frase** | Plain-language summary for a non-specialist (mandatory) |
| Description | Org + technical change |
| Pros / Cons | 2–4 each — understandable without opening a diagram |
| Affected areas | Teams, systems |
| Effort / risk | low / medium / high |
| Fit for constraints | How it meets deadline, regulation, skills |

### Step 6 — Recommendation

Deliver **decision inputs**, not only a single answer:

- **Recommended option** (primary) — state in **one plain sentence** first
- **Por que (em linguagem simples)** — 3 bullets max before technical fundamentação
- **Why** — tied to business architecture criteria and constraints
- **Conditions** — assumptions that must hold
- **What we are NOT doing** — explicit deferrals
- **ADR / governance action** — none | manter | revisar | novo ADR
- **Decision needed from user** — list 1–3 explicit yes/no or choices for the user

Escalate when: no product owner, regulatory ambiguity, or irreversible commitment without PoC.

### Step 7 — Parecer

Use [parecer-template.md](parecer-template.md). Pick sections by scenario (template marks optional blocks).

The parecer must let the user **defend a decision in a forum** (superintendência, comitê, workshop).

**Quality gate:**

1. Someone who only reads the resumo + section 7 (recomendação) + section 8 (decisões) can vote informed; architects use the rest for implementation.
2. Someone **visual** can trace AS IS → TO BE and compare options from **diagrams** without reading every paragraph.
3. ≥4 Mermaid diagrams; C4 Container TO BE present; captions on all blocks.

**Register in Archsphere:** `upsert_wbs_artifact` with `kind: solution_architecture` — full markdown including **embedded diagrams**, not links-only.

### Step 8 — Archsphere (optional)

When user wants traceability:

1. Find or create project in domain `Arquitetura` (or relevant domain)
2. Logbook: brief summary + decision status — **not** the full parecer
3. **`upsert_wbs_artifact`:** full parecer markdown (`kind: solution_architecture`) on the WBS child
4. WBS only when execution starts — **2–4 generic lifecycle phases** (Discovery → TO BE → Build); specialization in project tasks and WBS artifacts
5. Never store secrets in logbook or artifacts

See [archsphere-integration](../archsphere-integration/SKILL.md).

## Decision dimensions (apply to every case)

Score qualitatively (low / medium / high) when useful:

| Dimension | Question |
|-----------|----------|
| Strategic fit | Aligns with domain strategy and reference architecture? |
| Time to value | How fast is first useful delivery? |
| Total cost of ownership | Build, run, change over 2–3 years |
| Organizational fit | Skills, capacity, political support |
| Technical risk | Legacy, data quality, integration complexity |
| Coupling | Does this create hard dependencies between domains? |
| Reversibility | Can we undo or pivot without rewrite? |
| Compliance / audit | Regulatory or control requirements |

Include a **comparison table** across options on these dimensions in the parecer.

## Heuristics (patterns, not rules)

| Pattern | Typical lean |
|---------|--------------|
| Not core differentiator + mature market solution | Buy or integrate |
| Data and logic already at domain edge | Domain-owned build |
| Many consumers need same SLA | Platform / shared service |
| Metric is pure function of local data | Local calculation |
| Exclusive feeders/models in one team | That team owns end-to-end |
| Legacy platform being retired | Do not anchor TO BE on it |
| Contracted tool decommission in progress | Map who stopped consuming vs who still depends; gap is often transition, not only ADR wording |
| User needs decision fast | Recommend phased + PoC option |

## Anti-patterns

- Single option presented as fait accompli
- Jumping to technology before ownership and boundaries
- One-size-fits-all without segmentation analysis
- Parecer that describes problem but not comparable options
- Recommending only because an old ADR said so
- Treating every formula as a named "capability"
- **Parecer técnico sem resumo leigo** — C4 first, recommendation last
- **Siglas sem glossário** (ADR, NFR, API assumed known)
- **Opções só comparadas em jargão** — no “em uma frase” per option
- **Text-only or C4-only parecer** — missing integration flows, journey flowcharts, or per-option caixogramas
- **Section 3 business view as bullets only** when capability map / value stream diagrams exist upstream

## Additional resources

- Business assessment (upstream): [business-architecture](../business-architecture/SKILL.md)
- Complex features (unified doc): [design-doc](../design-doc/SKILL.md)
- Template: [parecer-template.md](parecer-template.md)
- Examples: [examples.md](examples.md) — dispute (duration) + greenfield (new capability)
