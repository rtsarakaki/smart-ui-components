---
name: software-development
description: >-
  Implement features and refactors with SOLID, functional style, immutability,
  guard clauses, small pure functions, and clean code. Use when the user asks to
  implement, develop, refactor, or review code; when picking up PM/UX/architecture
  handoffs; or mentions desenvolvedor, implementação, clean code, SOLID, programação
  funcional, imutabilidade, guard clauses, or boas práticas de código.
---

# Software Development

Turn **specs, stories, and UX decisions** into **correct, maintainable code**. This skill owns *how* code is written; PM/UX/architecture skills own *what* and *why*.

**Source code is always English** (names, comments, commits). Explain to the user in their language when helpful.

## When to apply

| Trigger | Examples |
|---------|----------|
| **Implement story/task** | Build feature from Archsphere task or PM spec |
| **Refactor** | Reduce complexity, extract pure helpers, fix smells |
| **Review local changes** | Check SOLID, immutability, guard clauses before commit |
| **Fix bug** | Minimal diff; add test when logic is a pure helper |
| **Handoff from PM/UX** | Task + acceptance criteria + UX spec → code |
| **Extract from Archsphere** | Implement presentational control here; host keeps domain/fetch |

Keywords: implementar, desenvolver, refatorar, clean code, SOLID, funcional, imutável, guard clause, código limpo, boas práticas, DataGrid, UI lib.

## Relationship to other skills

| Skill | Handoff |
|-------|---------|
| [product-management](../product-management/SKILL.md) | User stories + acceptance criteria → implementation scope |
| [ux-design](../ux-design/SKILL.md) | UX spec, click budget, visual tokens → UI implementation |
| [business-architecture](../business-architecture/SKILL.md) | Boundaries and rules → do not cross ownership in code |
| [solution-architecture](../solution-architecture/SKILL.md) | TO BE / ADR → follow agreed design; no silent drift |
| [design-doc](../design-doc/SKILL.md) | Complex feature handoff — §7 Implementation (API, data, rollout) |
| [archsphere-integration](../archsphere-integration/SKILL.md) | MCP/API writes; **open pending DORA deploy task** when starting production code changes |
| [qa-testing](../qa-testing/SKILL.md) | Tests from acceptance criteria; coverage before commit |

**Developer delivers:** working code, lint-clean diff.  
**QA delivers (with or after dev):** co-located tests, green `npm run test:coverage`.  
**Not dev scope:** product spec, UX prototype, architecture parecer (read and follow them).

## Core principles (non-negotiable)

These mirror workspace rules — **always apply** them; do not reintroduce patterns the rules forbid.

| Principle | Rule |
|-----------|------|
| **Guard clauses** | Validate early, return early; no `else`, no nested `if` chains |
| **Immutability** | `const` by default; spread/map/filter; never mutate args, state, or arrays in place |
| **Small functions** | One reason to change; extract pure helpers; keep I/O at boundaries |
| **Pure helpers** | Sort, pagination, and transforms as testable pure functions next to the control |
| **Explicit types** | Strict TS, no `any`; exported APIs have parameter and return types |
| **Presentational boundary** | No fetch/Supabase/domain types; generics + callbacks + label props |
| **Minimal scope** | Smallest correct diff; match existing conventions; no drive-by refactors |

Detailed patterns and before/after examples: [examples.md](examples.md).

## SOLID in this codebase

Apply SOLID **pragmatically** — prefer functions and modules over ceremony.

### Single Responsibility (SRP)

- One module/function does one job: `parseBurndownInstant` parses; it does not fetch or render.
- Split when a function needs a comment section (`// validation`, `// mapping`) — extract instead.
- React: container fetches/state; presentational components receive props and emit events.

### Open/Closed (OCP)

- Extend via **new functions or discriminated unions**, not growing `switch`/`if` ladders.
- Prefer lookup maps and strategy records over editing a central `if/else` tree for every variant.

### Liskov Substitution (LSP)

- Subtypes must honor the contract: if `ReadonlyArray<T>` is accepted, never mutate it.
- Shared interfaces (`ProjectTask`, form state unions) — implementations must not surprise callers.

### Interface Segregation (ISP)

- Narrow props and function args; avoid “god objects” passed through every layer.
- Split types: `ProjectSummary` vs `ProjectDetail` instead of one optional-heavy blob.

### Dependency Inversion (DIP)

- High-level flow depends on **abstractions at the boundary** (injected fetchers, server modules).
- `lib/` pure functions take data in, return data out — no direct Supabase/React imports in pure code.
- Server-only I/O in `*Server.ts` or route handlers; mark with `import "server-only"` when needed.

## Functional style

- **Prefer expressions over statements**: `map`/`filter`/`reduce` over imperative loops with mutation.
- **Composition**: build pipelines of small pure steps (`parse → validate → transform → serialize`).
- **No hidden effects**: a function named `compute*` or `parse*` must not write DB, set state, or log side effects.
- **Total functions when possible**: return `Result`/`null`/discriminated union instead of throwing for expected validation failures (match existing domain style).
- **Avoid classes** unless integrating with a class-based API; default to functions and plain types.

## Layering (Archsphere monorepo)

```
views/          → screen composition, minimal logic
components/     → reusable UI; leaf client components for interactivity
lib/<domain>/   → pure transforms + co-located .test.ts
lib/*Server.ts  → DB/API I/O, server-only
app/api/        → auth guard sequence → delegate to lib/
```

Follow globs rules when editing: `lib-domain-logic.mdc`, `domain-lifecycle-actions.mdc`, `views-and-components.mdc`, `api-route-handlers.mdc`, `typescript-standards.mdc`, `testing-vitest.mdc`, `i18n-messages.mdc`, `css-design-system.mdc`.

## Implementation workflow

```
- [ ] 1. Read handoff (task, acceptance criteria, UX spec, ADR if linked)
- [ ] 2. Locate domain folder and existing patterns (grep similar features)
- [ ] 3. Design pure core first (types, parse/validate/compute in lib/)
- [ ] 4. Add/co-locate tests for lib/ behavior
- [ ] 5. Wire UI or API boundary (thin adapter)
- [ ] 6. i18n for user-visible strings (English keys in locale files)
- [ ] 7. Run npm run lint and npm run test:coverage from repo root
- [ ] 8. Mark Archsphere task done only when acceptance criteria pass
```

## Control flow checklist

Before finishing, scan the diff for:

- [ ] No `else` after `if` (use early return or map lookup)
- [ ] No `if` nested more than one level deep in business logic
- [ ] No `let` unless a local loop accumulator is unavoidable (prefer `reduce`)
- [ ] No `.push`, `.sort()` in place on shared data, or direct property assignment on inputs
- [ ] No `any`, `@ts-ignore`, or untyped `catch (e)`
- [ ] Exported functions have explicit return types
- [ ] React state updates use new objects/arrays

## Testing

- **Primary target**: pure functions in `lib/` (parsing, validation, transforms).
- Co-locate: `foo.ts` + `foo.test.ts`.
- Component tests: Testing Library, roles/labels — not implementation details.
- **80% coverage** enforced by pre-commit; do not skip hooks unless the user explicitly asks.

## Quality gates

From repo root:

```bash
npm run lint
npm run test:coverage
```

Fix all ESLint and type errors before considering the task done.

## Anti-patterns (reject on review)

| Smell | Fix |
|-------|-----|
| 80-line handler with SQL, validation, and mapping | Extract lib helpers + thin route |
| `if (role === "a") { ... } else if (role === "b")` | Record map of handlers or switch on discriminant |
| Mutable “builder” accumulating arrays | `[...acc, item]` or `reduce` |
| Prop drilling 5 levels | Colocate state or extract hook in `lib/hooks/` |
| Duplicate validation in API and form | Single pure validator in `lib/`, call from both |
| UI string hardcoded in JSX | `useTranslations` / locale messages |
| Generic PATCH/PUT of `status`, `kind`, or transition timestamps | Named lifecycle action (`*Lifecycle.ts` + POST route); block on generic save |

## Domain lifecycle (no anemic state CRUD)

Workflow fields change only through **explicit business actions**, not attribute assignment on generic update.

Full rule: `.cursor/rules/domain-lifecycle-actions.mdc`.

| Layer | Responsibility |
|-------|----------------|
| `*Lifecycle.ts` | Pure guards (`can*`), patch builders, block direct status PATCH |
| `*LifecycleServer.ts` | Load entity, validate transition, persist side effects |
| `POST /api/.../<action>` | Thin handler per transition |
| UI | Read-only status + buttons; import `can*` from `lib/` |
| Integration/bulk save | Reject direct `status` / `kind` changes |

Reference: `projectLifecycle.ts`, `projectTaskLifecycle.ts`.

When adding new workflow state, complete the checklist in `domain-lifecycle-actions.mdc` (state diagram, tests, block generic PATCH, WBS artifact if product feature).

## DORA deploy task (Archsphere deliveries)

When the user requests a **production code change** in this repo (implement, fix, refactor, UI/API):

1. **Before editing files**, follow [archsphere-integration](../archsphere-integration/SKILL.md) **DORA deploy phase 1**: open a **`kind: deploy`** task with **`status: pending`** on the target project; keep **`deployTaskId`** for the session.
2. Implement and test as usual.
3. **Do not** complete the deploy task when coding finishes — completion happens on **push** ([git-commit](../git-commit/SKILL.md) phase 2).

Skip phase 1 only when the user explicitly says the work will not deploy, or the turn is question/review-only.

## Archsphere story tasks

When implementation satisfies acceptance criteria for a **product/story task** (not the deploy task):

1. Update the related story task via MCP (`update_task` → `status: "completed"`) if the user expects workspace tracking.
2. Append a short logbook entry with what shipped and any follow-ups (optional, user-driven).

Do not invent scope beyond the story; flag gaps back to PM/UX.

## Further reading

- [examples.md](examples.md) — SOLID, FP, guard clauses, React immutability
- `.cursor/rules/clean-code.mdc` — authoritative guard clause + immutability rules
- `.cursor/rules/domain-lifecycle-actions.mdc` — lifecycle actions vs anemic status CRUD
- `.cursor/rules/typescript-standards.mdc` — strict typing
- `.cursor/rules/quality-gates.mdc` — lint, coverage, pre-commit
