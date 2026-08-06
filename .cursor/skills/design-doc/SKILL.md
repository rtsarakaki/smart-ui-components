---
name: design-doc
description: >-
  Unify product, UX, and solution design for complex features into one design
  document with clear handoffs to development. Use when a feature crosses systems,
  needs TO BE before build, or combines PM + UX + architecture deliverables.
  Deliverables must include a visual index: end-to-end diagrams linking product,
  UX, solution, and security sections (Mermaid) — not text-only assembly docs.
  Links to feature-spec, ux-spec, and parecer templates instead of replacing them.
---

# Design Doc (features complexas)

One **design doc** is the **index and decision record** for a complex feature. It does not replace specialized specs — it **links and summarizes** them so PM, UX, architecture, and dev share one entry point.

Write in the **user's language** (typically Portuguese). Code and API names stay in English when they are implementation identifiers.

## When to use

| Situation | Use design doc? | Minimum pack |
|-----------|-----------------|--------------|
| Simple CRUD / UI tweak in one module | No | Feature spec or UX spec only |
| Feature with UI, single bounded context | Optional | Feature spec + UX spec |
| **Cross-system integration** | **Yes** | Design doc + parecer (or § Solution embedded) |
| **Ownership / capability dispute** | **Yes** | business-architecture assessment + design doc |
| **Auth, MCP, API, sensitive data** | **Yes** | + security-architecture assessment |
| **Migration / phased rollout** | **Yes** | Design doc § Rollout mandatory |

**Complexity signals (any 2+ → design doc):**

- More than one team or domain owner
- New or changed integration contract (API, event, batch)
- Persistent data model change or migration
- Regulatory / audit / security review expected
- Phased delivery (platô, feature flag, parallel run)
- UI + backend + external system in same initiative

## Relationship to other skills

| Skill | Role in design doc |
|-------|-------------------|
| [product-management](../product-management/SKILL.md) | § Product — FRs, stories, success metrics |
| [ux-design](../ux-design/SKILL.md) | § Experience — flows, states, click budget (if UI) |
| [business-architecture](../business-architecture/SKILL.md) | § Business context — capabilities, ownership |
| [solution-architecture](../solution-architecture/SKILL.md) | § Solution — AS IS / TO BE, options, recommendation |
| [security-architecture](../security-architecture/SKILL.md) | § Security — threats, controls (when applicable) |
| [software-development](../software-development/SKILL.md) | § Implementation — consumes § API, data, rollout |
| [qa-testing](../qa-testing/SKILL.md) | § Verification — test strategy from FR + NFR |
| [archsphere-integration](../archsphere-integration/SKILL.md) | Persist as WBS artifact `kind: solution_architecture` or `other` |

**Rule:** Do not duplicate full parecer or UX spec inside the design doc — use **summary + link** (or Archsphere artifact id). Paste full text only when there is no separate artifact yet (draft phase).

**Visual rule:** Even when linking specialized artifacts, the design doc must include an **integrated visual layer** (§ Visual documentation) so a reader grasps the whole feature from **one document** without opening every attachment.

## Visual documentation (mandatory)

The design doc is the **single map** of a complex feature. It must be **graphically navigable**, not only a table of links.

### Minimum diagram set in the design doc

| # | Diagram | Section | Purpose |
|---|---------|---------|---------|
| D1 | **End-to-end feature map** | §0 or §1 | One flowchart: user → UI → API → data → external systems |
| D2 | **User journey** | §3 | Happy path + key branches (from UX spec, embedded or summarized) |
| D3 | **AS IS → TO BE** | §5 | Delta caixograma (reuse solution-architecture diagrams or embed) |
| D4 | **Trust / security zones** | §6 | Boundaries when auth/MCP/API/PII (reuse security assessment) |
| D5 | **Rollout phases** | §7 | Timeline or flowchart of platôs / flags |

**Floor:** at least **3 Mermaid diagrams** in every design doc; **5** when UI + integration + security all apply.

### Rules

- **Embed or summarize** diagrams from AN, AS, UX, security artifacts — do not leave §4–§6 as bullets-only when upstream artifacts have diagrams.
- Every embedded diagram: *Leitura:* caption above the block.
- §0 resumo may reference “ver Diagrama D1” for visual readers.
- Anti-pattern: design doc that is only tables and links with **zero** Mermaid blocks.

## Workflow

```
- [ ] 1. Classify complexity (table above)
- [ ] 2. Open design doc from design-doc-template.md
- [ ] 3. PM fills § Product (or link feature-spec)
- [ ] 4. UX fills § Experience if UI (or link ux-spec + journey diagram D2)
- [ ] 5. Architecture fills § Solution (+ business/security as needed; embed AS IS/TO BE D3)
- [ ] 6. Dev/PM fill § Implementation plan (API, data, tasks, rollout D5)
- [ ] 7. Assemble **integrated visual layer** (≥3 Mermaid — § Visual documentation)
- [ ] 8. Review: open decisions resolved or explicitly deferred
- [ ] 9. Archsphere: upsert_wbs_artifact on "TO BE approved" WBS child + logbook line
- [ ] 10. Handoff: code tasks use task-spec-template in plain language
```

### Handoff order

```
product-management ──► ux-design (if UI)
        │
        ├──► business-architecture (if ownership unclear)
        │
        └──► solution-architecture ──► security-architecture (if sensitive)
                      │
                      └──► design doc (assemble) ──► software-development + qa-testing
```

## Archsphere persistence

| Artifact | When |
|----------|------|
| **WBS artifact** | Design doc approved for build — full markdown **with embedded diagrams**, link to WBS child e.g. "TO BE specification approved" |
| **Logbook** | One line: version + "design doc vN approved for [feature]" |
| **Tasks** | Implementation stories cite `Design doc §4.2 API-1`, not duplicate API tables |

`kind`: `solution_architecture` when TO BE dominates; `other` when product-led with light tech section.

## Triggers

design doc, documento de design, RFC, spec técnica, feature complexa, TO BE + stories, handoff dev, especificação integrada

## Additional resources

- Template: [design-doc-template.md](design-doc-template.md)
- Product: [feature-spec-template.md](../product-management/feature-spec-template.md)
- UX: [ux-spec-template.md](../ux-design/ux-spec-template.md)
- Architecture: [parecer-template.md](../solution-architecture/parecer-template.md)
