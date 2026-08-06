# AGENTS.md — smart-ui-components

Guidance for AI agents working in this repository.

## Project

**smart-ui-components** is a **React UI component library** (npm). It extracts reusable presentational controls (starting with `DataGrid`) for Archsphere and satellite apps. It is **not** a Next.js app or monorepo product codebase.

## Quality commands

Run from repository root:

| Command | Purpose |
|---------|---------|
| `npm run quality` | type-check + lint + tests |
| `npm run test:coverage` | Vitest with coverage |
| `npm run build` | Emit `dist/` |
| `npm run lint:check` | ESLint |

**Never skip pre-commit / CI quality** (`--no-verify`) unless the user explicitly requests it.

## Agent layers

| Layer | Location | Role |
|-------|----------|------|
| **Rules** | `.cursor/rules/*.mdc` | Coding and delivery invariants |
| **Skills** | `.cursor/skills/*/SKILL.md` | Playbooks loaded per task type |
| **Skill routing** | `.cursor/skills/skill-routing/SKILL.md` + `.cursor/rules/skill-routing.mdc` | Classify → pick skills → handoff |

Full catalog and **what was omitted** from the Archsphere app repo: `.cursor/rules/index.mdc`.

## Archsphere (Arqueosfera)

MCP server: **`user-archsphere-pessoal`**.

| Field | Value |
|-------|-------|
| Project | Lib de componentes visuais do Archsphere |
| Project id | `0005059b-c4d1-4140-a470-26af63f214b8` |
| Product | Arqueosfera `925d6924-06b3-4954-87e8-685eaa1cb239` |

All workspace writes go through **MCP only**. See `.cursor/rules/mcp-credentials.mdc` and `.cursor/skills/archsphere-integration/SKILL.md`.

**DORA:** every successful push → complete `kind: deploy` via `implant_task` — `.cursor/rules/dora-deploy.mdc`.

## Library conventions

- Presentational components + pure helpers; **no** domain/Supabase/fetch inside the package.
- Host apps supply CSS via `hostClassNames` / class names and i18n via label props.
- English source and Conventional Commits (see rules).
- Incremental extraction: implement in this lib → consume in Archsphere → validate → next component.

## Selection from Archsphere artifacts

**Kept:** clean-code, English, quality gates, TS, Vitest, React component API, skill-routing, PM, UX, design-doc, solution/security architecture, software-dev, QA, delivery-reviewer, git-commit, Archsphere MCP/logbook/DORA, agent-artifacts docs, commit messages, CI publish.

**Omitted (app-only):** Next.js App Router, Supabase, monorepo layout, i18n message catalogs, domain lifecycle PATCH, API routes, commercial/content/YouTube/people/business-architecture/create-project/disk-cleanup/SVO consumer.
