---
name: qa-testing
description: >-
  Plan and write tests, verify acceptance criteria, and enforce coverage gates.
  Use when the user asks for QA, tests, testes, cobertura, coverage, Vitest,
  regression, test plan, critérios de aceite verificados, bug reproduction,
  or before committing feature work. Derives test cases from PM stories and
  UX specs; complements software-development with test-first and behavior focus.
---

# QA & Testing

Turn **acceptance criteria and expected behavior** into **automated tests** that protect regressions and satisfy the **80% coverage** pre-commit gate.

Test code is **English** (describe/it names, comments). Explain plans to the user in their language when helpful.

## When to apply

| Trigger | Examples |
|---------|----------|
| **Write tests** | New `*.test.ts` / `*.test.tsx` for lib or components |
| **QA review** | Map acceptance criteria → test cases before ship |
| **Bug fix** | Reproduce with failing test, then fix |
| **Coverage gap** | Pre-commit failed or new code without tests |
| **Regression** | Guard behavior that broke in production |
| **Integration/MCP** | API serialization, security, route handlers |

Keywords: QA, teste, testes, Vitest, cobertura, coverage, regressão, critério de aceite, Testing Library, TDD, test plan.

## Relationship to other skills

| Skill | Handoff |
|-------|---------|
| [skill-routing](../skill-routing/SKILL.md) | Evaluate QA need on every request |
| [product-management](../product-management/SKILL.md) | **Acceptance criteria** → test scenarios |
| [ux-design](../ux-design/SKILL.md) | Flows, states, a11y labels → component tests |
| [software-development](../software-development/SKILL.md) | Pure logic in `lib/` — QA tests; dev may co-write unit tests |
| [archsphere-integration](../archsphere-integration/SKILL.md) | Integration API/MCP contracts → integration tests |
| [security-architecture](../security-architecture/SKILL.md) | Threat model findings → security acceptance criteria & tests |
| [git-commit](../git-commit/SKILL.md) | Commit only after `npm run test:coverage` passes |

**QA delivers:** test plan (when non-trivial), co-located tests, green coverage run.  
**Not QA scope:** product spec, UX design, production implementation (unless fixing test gaps via minimal prod change).

## Workflow

```
- [ ] 1. Gather behavior source (acceptance criteria, UX spec, bug report, or code diff)
- [ ] 2. Choose test layer (lib unit → integration → component)
- [ ] 3. List scenarios: happy path, validation errors, edge cases, permissions
- [ ] 4. Write/co-locate tests (red → green for bugs)
- [ ] 5. Run npm run test:coverage from repo root
- [ ] 6. Fix gaps; do not skip hooks unless user explicitly asks
```

For **greenfield features**, QA runs **after or alongside** dev — at minimum before commit. For **bugs**, test **first** (failing), then fix.

## Test pyramid (this package)

| Layer | Where | Priority | Tools |
|-------|--------|----------|--------|
| **Unit (pure)** | `src/**/*.test.ts` (sort, pagination) | **Highest** | Vitest, table-driven cases |
| **Component** | Co-located `*.test.tsx` (`DataGrid`, `ListPagination`) | High | Testing Library + jsdom |
| **E2E / visual** | Not standard here | Only if user requests | Host app (Archsphere) |

Follow `.cursor/rules/testing-vitest.mdc` for style. Run `npm run quality` / `npm run test:coverage` from **this repo root**.

## What to test

| Test | Yes | No |
|------|-----|-----|
| Parsers, validators, transforms | ✅ | |
| Business rules (dates, merge, permissions) | ✅ | |
| API serialization round-trips | ✅ | |
| User-visible flows (add, save, empty state) | ✅ | |
| Implementation details (state variable names) | | ❌ |
| Third-party libraries | | ❌ |
| Trivial getters / one-line wrappers | | ❌ |
| Snapshot of entire pages | | ❌ (prefer roles/labels) |

## Mapping acceptance criteria → tests

Each **Given / When / Then** from PM maps to one or more `it(...)` blocks:

| Acceptance criterion | Test type | Example assert |
|---------------------|-----------|------------------|
| Invalid URL rejected | lib or component | Toast/error message; `onPersist` not called |
| Empty list shows hint | component | `getByText` empty copy |
| Artifact linked to WBS child | lib | `parseProjectWbsArtifacts` returns linked ids |
| Unauthorized API call | integration | `401` + `{ message }` shape |

Document gaps: if AC cannot be automated cheaply, note manual check in response — do not skip without saying so.

## Conventions

- **Co-locate:** `foo.ts` + `foo.test.ts` in the same folder.
- **Import alias:** `@/` for app tests; relative imports OK in `archsphere-mcp/`.
- **Component tests:** wrap with `renderWithLocale` from `@/test/render-with-locale` (or `LocaleProvider` + `ActionToastProvider` when narrower scope fits — see [examples.md](examples.md)).
- **Queries:** roles, labels, visible text — not `container.querySelector('.internal-class')` unless no a11y hook exists.
- **Async:** `waitFor` after clicks that persist or toast.
- **Mocks:** `vi.mock` for Server Actions and external modules; keep mocks at boundary.
- **Pure tests:** no `jsdom` needed — import function, assert return value.
- **Immutability:** assert new arrays/objects, not mutated inputs (align with clean-code).

## Commands

From repo root:

```bash
npm run test              # run once
npm run test:watch        # local iteration
npm run test:coverage     # required before commit (80% gate)
```

For MCP-only changes:

```bash
npm --prefix archsphere-mcp test
```

## Bug-fix protocol

1. Reproduce with a **failing test** at the lowest layer that owns the bug.
2. Fix production code with **minimal diff** (software-development).
3. Confirm test passes + coverage still green.
4. Do not delete tests to make coverage pass.

## Quality gates

- **80%** lines, branches, functions, statements (Husky pre-commit).
- ESLint clean on test files (`npm run lint`).
- No `@ts-ignore` in tests without documented reason.

## Anti-patterns

| Smell | Fix |
|-------|-----|
| Test only `toBeTruthy()` | Assert concrete values/shapes |
| Giant single test | One behavior per `it` |
| Copy-paste setup in every file | Extract `renderPanel` / factory helpers in test file |
| Test CSS class as behavior | Use role/label/text |
| Skip coverage by excluding files | Add meaningful tests |
| Commit without running coverage | Always run from repo root |

## Further reading

- [examples.md](examples.md) — lib, component, integration, bug-fix patterns
- `.cursor/rules/testing-vitest.mdc`
- `.cursor/rules/quality-gates.mdc`
