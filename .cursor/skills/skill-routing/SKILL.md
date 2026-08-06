---
name: skill-routing
description: >-
  Evaluate which project skills apply to each new user request before acting.
  Use at the start of every conversation turn that introduces or shifts work —
  components, UX, code, architecture, Archsphere writes, commits, or mixed asks.
  Read this skill first when skill-routing.mdc applies or when unsure which
  skills to load.
---

# Skill routing

**Gate for every new request:** classify → select skills → read their `SKILL.md` → execute in handoff order.

Do **not** apply skills retroactively to finished work unless the user explicitly asks. Always evaluate **forward** for the current ask.

**Repo context:** `smart-ui-components` is a **React UI component library** published to npm. Prefer presentational APIs, host-themeable class names, and pure helpers — not app boards or backend.

## Evaluation workflow

```
- [ ] 1. What is the user asking for now? (not the whole chat history)
- [ ] 2. Which skills from the matrix below apply?
- [ ] 3. Read each selected SKILL.md before work on that concern
- [ ] 4. Respect handoff order when multiple skills apply
- [ ] 5. If a required skill is missing context (no spec, no UX), produce it or ask — do not silently skip
```

When several skills apply, state briefly which ones you are following (one line is enough).

## Project skills catalog

| Skill | Path | Apply when |
|-------|------|------------|
| **skill-routing** | [SKILL.md](SKILL.md) | Every new/shifted request |
| **product-management** | [product-management/SKILL.md](../product-management/SKILL.md) | New/enhanced **component capability**, backlog, user stories, “funcionalidade” |
| **design-doc** | [design-doc/SKILL.md](../design-doc/SKILL.md) | **Complex compound** (e.g. DataGrid+toolbar) — unified design; **≥3 Mermaid diagrams** |
| **ux-design** | [ux-design/SKILL.md](../ux-design/SKILL.md) | Interaction, a11y, keyboard, host visual contract; **≥2 diagrams** per UX spec |
| **solution-architecture** | [solution-architecture/SKILL.md](../solution-architecture/SKILL.md) | Public API shape, packaging, peer deps, TO BE; **≥4 Mermaid** when full parecer |
| **security-architecture** | [security-architecture/SKILL.md](../security-architecture/SKILL.md) | XSS via `render`, unsafe HTML, supply-chain; **≥3 diagrams** when full assessment |
| **software-development** | [software-development/SKILL.md](../software-development/SKILL.md) | Implement / refactor / fix in `src/` |
| **qa-testing** | [qa-testing/SKILL.md](../qa-testing/SKILL.md) | Vitest, coverage, acceptance criteria |
| **delivery-reviewer** | [delivery-reviewer/SKILL.md](../delivery-reviewer/SKILL.md) | Meta-review before ship |
| **archsphere-integration** | [archsphere-integration/SKILL.md](../archsphere-integration/SKILL.md) | MCP writes; DORA deploy lifecycle |
| **git-commit** | [git-commit/SKILL.md](../git-commit/SKILL.md) | Commit / push |
| **agent-artifacts-documentation** | [agent-artifacts-documentation/SKILL.md](../agent-artifacts-documentation/SKILL.md) | Catalog markdown for rules/skills |

Repo **rules** (`.cursor/rules/*.mdc`) always apply alongside skills.

## Routing matrix (quick)

| Request pattern | Skills to read (typical order) |
|-----------------|--------------------------------|
| New compound UI control | PM → UX → design-doc (if complex) → security (if HTML/XSS) → software-development → qa-testing → archsphere-integration if persisting |
| Pure helper / bugfix / refactor | archsphere-integration (deploy phase 1 if shipping) → software-development → qa-testing |
| Public API / packaging change | solution-architecture → software-development → qa-testing |
| A11y / interaction only | UX → software-development → qa-testing |
| Threat / XSS / supply chain | security-architecture |
| Register/update Archsphere data | archsphere-integration |
| Commit | delivery-reviewer (substantial) → git-commit (after quality green) |
| Push | git-commit → **archsphere-integration** (`implant_task` — DORA phase 2) |
| Review / melhor proposta | delivery-reviewer |
| Document rules/skills catalog | agent-artifacts-documentation |
| Explain / question | Load skills only if the answer needs their workflow |

## Handoff order

```
product-management ──► ux-design (UI controls)
        │
        ▼
solution-architecture / design-doc (when API or compound is non-trivial)
        │
        ▼
security-architecture (render HTML, dangerous props, publish surface)
        │
        ▼
software-development
        │
        ▼
qa-testing
        │
        ▼
delivery-reviewer (substantial)
        │
        ▼
archsphere-integration / git-commit
```

## Decision helpers

### Does UX apply?

**Yes** if: props that change interaction, keyboard, focus, empty/loading states, action buttons, sort/pagination UX, host class mapping that affects usability.  
**No** for: pure sort/pagination math with no UI change, chore CI, docs-only.

### Does PM apply?

**Yes** if: new component or material behavior change for consumers.  
**No** for: typo, internal rename, dependency bump.

### Does security-architecture apply?

**Yes** if: `dangerouslySetInnerHTML`, markdown/HTML rendering, dynamic `href`, new peer dependency with network, weakening publish provenance.  
**No** for: ordinary presentational markup with React text children.

## Anti-patterns

| Anti-pattern | Do instead |
|--------------|------------|
| Implement a new grid without UX scan | Load ux-design; keep a11y labels and keyboard |
| Put Archsphere domain types in the lib | Keep presentational generics + callbacks |
| Skip QA before publish | `npm run quality` / coverage |
| Skip DORA on push | `implant_task` on project `0005059b-…` |
| Copy Next/Supabase rules from the app | Use this repo’s curated set (see `rules/index.mdc`) |

## Token-aware defaults

| Situation | Minimum skills |
|-----------|----------------|
| Question-only | None unless workflow required |
| Trivial fix | software-development (+ qa-testing if prod code) |
| New component | PM → UX → software-development → qa-testing |

## Related

- Always-on gate: [skill-routing.mdc](../../rules/skill-routing.mdc)
- Catalog: [index.mdc](../../rules/index.mdc)
- Entry: [AGENTS.md](../../../AGENTS.md)
