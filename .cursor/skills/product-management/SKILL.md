---
name: product-management
description: >-
  Specify new product features and break them into user stories with acceptance
  criteria, then register stories as project tasks in Archsphere via MCP. Use when
  the user acts as PM, asks to specify funcionalidades, write user stories, backlog,
  product spec, histórias de usuário, registrar tarefas no Archsphere, or decompose
  a feature into deliverable work items on an existing or new project.
---

# Product Management (Archsphere)

Turn **ideas and features** into **clear specifications** and **actionable tasks** in Archsphere. The PM skill owns *what* and *why*; architecture skills own *how* when needed.

Write specs and stories in the **user's language** (typically Portuguese). Keep task names and descriptions in the same language unless the product is English-only.

## When to apply

| Trigger | Examples |
|---------|----------|
| **New feature** | Specify and backlog a capability |
| **Enhancement** | Extend existing product area |
| **Decompose initiative** | Break epics into stories/tasks |
| **Register in Archsphere** | Create tasks from agreed stories |
| **PM review** | Refine vague request into spec + backlog |

Keywords: PM, product manager, funcionalidade, especificação, user story, história, backlog, critérios de aceite, registrar tarefas, Arqueosfera, Archsphere.

## Relationship to other skills

| Skill | Handoff |
|-------|---------|
| [ux-design](../ux-design/SKILL.md) | Feature has UI → UX spec + prototype before dev stories are final |
| [content-writing](../content-writing/SKILL.md) | Articles, chapters, scripts, YouTube copy — after brief is clear |
| [sem-bala-de-prata](../sem-bala-de-prata/SKILL.md) | NotebookLM master prompt, slogan, episode context — canal YouTube |
| [business-architecture](../business-architecture/SKILL.md) | Capability/ownership unclear → spec pauses until boundaries defined |
| [solution-architecture](../solution-architecture/SKILL.md) | Technical parecer needed → link in spec; do not invent TO BE |
| [design-doc](../design-doc/SKILL.md) | **Complex feature** → unified design doc (product + UX + solution + implementation) |
| [archsphere-integration](../archsphere-integration/SKILL.md) | MCP/API field rules, catalog, WBS artifacts |
| [software-development](../software-development/SKILL.md) | Stories ready → implementation |
| [qa-testing](../qa-testing/SKILL.md) | Acceptance criteria → automated tests before ship |
| [content-writing](../content-writing/SKILL.md) | Prose quality, tone, persuasion on text deliverables |
| [delivery-reviewer](../delivery-reviewer/SKILL.md) | Review PM/UX/arch/dev/QA outputs; best proposal check |

**PM delivers:** feature spec + user stories as **project tasks**.  
**Not PM scope:** coarse **generic** WBS phases (project owner/architect), full parecer, code implementation, writing tests (QA skill).

## Workflow

```
- [ ] 1. Frame the feature
- [ ] 1b. If complex (see design-doc skill) — plan unified design doc
- [ ] 2. Write feature specification
- [ ] 3. Decompose into user stories
- [ ] 4. Confirm Archsphere target (project / create)
- [ ] 5. Register tasks (create_task)
- [ ] 6. Optional: logbook + feature spec artifact
- [ ] 7. Present summary to user
```

### Step 1 — Frame the feature

| Item | Question |
|------|----------|
| **Problem / opportunity** | What pain or gain? |
| **Target users** | Who benefits? |
| **Business outcome** | Measurable success (1–2 metrics) |
| **Scope** | In / out |
| **Constraints** | Deadline, compliance, dependencies |
| **Priority** | Must / should / could (MoSCoW) |

If critical gaps remain, ask **one grouped message** (≤5 bullets).

### Step 2 — Feature specification

Use [feature-spec-template.md](feature-spec-template.md). Minimum sections:

1. Context and goal  
2. Users and scenarios  
3. Functional requirements (numbered)  
4. Non-functional requirements (if any)  
5. Out of scope  
6. Open questions / decisions for user  

Keep requirements **testable** — avoid vague "should be easy".

**If the feature has UI:** run [ux-design](../ux-design/SKILL.md) in parallel or immediately after — PM owns FRs; UX owns flows, states, copy, and dev handoff. Link UX spec id in FR table.

**If the feature is complex** (cross-system, migration, security-sensitive, multi-team): run [design-doc](../design-doc/SKILL.md) — use [design-doc-template.md](../design-doc/design-doc-template.md) as the **single entry point**; embed or link this feature spec as §2 Product.

### Step 3 — User stories

Decompose into **vertical slices** (end-to-end thin value), not horizontal layers only.

**Story format:**

```
Como [persona], quero [ação], para [benefício].
```

**Each story must include:**

| Field | Content |
|-------|---------|
| **Title** | Short imperative — becomes Archsphere task `name` |
| **Description** | Story + context (markdown in task body) |
| **Acceptance criteria** | Given / When / Then (≥2 per story) |
| **Priority** | MoSCoW or P1/P2/P3 |
| **Dependencies** | Other stories or teams |
| **Suggested owner** | Name → resolve via catalog |

**Sizing:** one story = one task, completable in roughly **≤2 weeks** by one team. Split if larger.

**INVEST check (quick):**

| Letter | Pass? |
|--------|-------|
| Independent | Minimal hard deps |
| Negotiable | Not a fixed design doc |
| Valuable | User/business visible |
| Estimable | Clear enough to size |
| Small | Fits task rule above |
| Testable | AC are verifiable |

### Step 4 — Archsphere target

1. `get_workspace_catalog` — domains, participants  
2. `list_projects` — find existing project by name/domain/objective  
3. Decide with user if ambiguous:

| Situation | Action |
|-----------|--------|
| Feature fits **existing** project | Use that `projectId` |
| **New** product initiative | `create_project` (full payload — see archsphere-integration) |
| One-off ops work | `create_standalone_task` (only if not tied to a project) |

**Default:** attach stories to an **existing** project when the user names one or context matches.

Do not create duplicate projects for the same initiative.

### Step 5 — Register tasks

For each story, `create_task` with **rich payload**:

| Field | Source |
|-------|--------|
| `projectId` | Step 4 |
| `name` | Story title (≤80 chars if possible) |
| `description` | Story text + **Acceptance criteria** (markdown) + link to FR ids from spec |
| `status` | `pending` |
| `createdAt` | Today `YYYY-MM-DD` |
| `targetDate` | From user or inferred sprint/milestone |
| `responsibleParticipantId` | Catalog — ask if unknown |
| `criticality` | Map: P1/blocker → `high`; P2 → `medium`; P3 → `low` |

**Before create:** `list_project_tasks` on the project — skip duplicates (same name or same AC).

**Batch:** create all stories in one session; report IDs/names after.

**Description template for tasks** — full structure in [task-spec-template.md](task-spec-template.md):

```markdown
## Caso de uso
Como [ator], quero [ação], para [benefício].

| Campo | Conteúdo |
|-------|----------|
| Ator principal | |
| Pré-condições | |
| Fluxo principal | 1. … |
| Pós-condições | |

## Critérios de aceite
- [ ] Dado …, quando …, então …

## Especificação técnica *(somente construção de código)*
…
### Referências
…

## Entregáveis leves *(sem código — omitir especificação técnica)*
| Entregável | Formato | Destino |
…
```

**Mandatory on every task:** **Em uma frase** + caso de uso + **Está pronto quando…** (critérios de aceite), all in **plain language** (see task-spec-template).

**Especificação técnica (completa):** only when the task delivers **merged code**. Lead with *what changes for users/systems*; then file/module detail for devs.

**Entregáveis leves:** alignment, governance, workshops — use **O que entregar** table; explain acronyms in a short glossary.

### Plain language for task bodies

- First line after title sections: **Em uma frase** — anyone on the project can paraphrase it
- Expand acronyms on first use (GMT = Gestão da Tesouraria, MM = sigla em desativação, etc.)
- Acceptance criteria must be checkable without insider knowledge
- Name **who** executes and **who** validates

### Step 6 — Optional Archsphere extras

| Artifact | When |
|----------|------|
| **Logbook** | Feature specced and backlog loaded — short entry with story count + link to epic name |
| **WBS artifact** | User wants full spec stored — `upsert_wbs_artifact` with `kind: other`, link to relevant WBS child if exists |
| **Design doc artifact** | Complex feature — full design doc markdown (`kind: solution_architecture` or `other`) on WBS child "TO BE specification approved"; see [design-doc](../design-doc/SKILL.md) |
| **update_project.objective** | Only if user asks to extend project objective with new scope |

Do not rewrite project WBS unless user explicitly requests phase planning. When the user asks for phases, prefer the **generic lifecycle** (Discovery → TO BE → Build) — see [archsphere-integration](../archsphere-integration/SKILL.md) WBS rules.

### WBS vs tasks (default pattern)

| Layer | What goes here | Examples |
|-------|----------------|----------|
| **WBS phase (level 1)** | Generic lifecycle stage | Discovery & alignment, Specification (TO BE), Build & validation |
| **WBS child (level 2)** | Outcome milestone | “TO BE approved”, “MVP validated” |
| **Project task** | Specialized work packages | UX spec, data model, API Integration v1, UI implementation, migrations |
| **WBS artifact** | Full markdown deliverable | Parecer, ADR draft, **design doc**, feature spec — linked to the WBS child being closed |

Several tasks may support one WBS child. Do **not** create separate WBS children for UI, API, database, or code unless the user explicitly wants a non-standard breakdown.

### Step 7 — Deliver to user

Present:

1. Feature spec (markdown)  
2. Story table: title | priority | owner | target date | Archsphere task created (Y/N)  
3. Open questions and recommended next step (architecture review, refinement workshop, sprint start)

## Story splitting heuristics

| Split when | Pattern |
|------------|---------|
| Story covers multiple personas | One story per persona |
| CRUD all at once | Create / Read / Update / Delete as separate stories if large |
| Multiple business rules | One story per rule cluster |
| Integration + UI | API contract story first, then UI (if teams differ) |
| "And" in title twice | Likely two stories |

## Anti-patterns

- Tasks with name only — always use [task-spec-template.md](task-spec-template.md): **Em uma frase**, caso de uso claro, critérios verificáveis; spec técnica só em tarefas de código  
- Technical tasks disguised as stories without user value — reframe or label as enabler in description  
- Duplicate project for same feature  
- Inventing participant UUIDs — catalog first  
- Replacing WBS with a flat task dump — tasks complement WBS, not replace phases  
- Naming WBS children after specialties (UI, API, DB) — use tasks for that; WBS stays generic  
- Specifying implementation (framework, DB) before requirements — note as TBD or hand to solution-architecture  

## Additional resources

- Template: [feature-spec-template.md](feature-spec-template.md)  
- Task bodies: [task-spec-template.md](task-spec-template.md)  
- Examples: [examples.md](examples.md)  
- Archsphere writes: [archsphere-integration](../archsphere-integration/SKILL.md)
