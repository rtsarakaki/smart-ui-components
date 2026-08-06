---
name: archsphere-integration
description: >-
  Operate Archsphere via MCP only (projects, tasks, results, logbook, skill
  scores). Use when automating Arqueosfera/Archsphere with archsphere MCP tools
  or creating/updating workspace data. Never call Integration API, curl, or
  fetch with extracted keys from the agent — see mcp-credentials.mdc. Open a
  pending DORA deploy task when a production code change is requested; complete
  that task on successful git push (see DORA deploy lifecycle).
  Prefer rich payloads: fill all applicable fields and ask the user for missing
  details before writing. WBS must stay coarse and minimal (few phases/deliverables),
  every level-1 phase must have children (progress is computed from children only),
  with dark stage colors for light-theme readability. On project/task completion,
  infer skills and impact from logbook history and create a participant result.
  Before completing a project, all WBS children must be done. WBS dates must stay
  within project start/target. On deletes, verify the exact record first. Logbook
  is append-only: use append_logbook_entry per event; never send logbook.entries
  on update_project.
---

# Archsphere Integration (MCP)

Workspace scope is **fixed per MCP server API key**. Never pass `workspaceOwnerId`, `owner_id`, or similar override fields.

**MCP reference:** field checklists, tool table, JSON examples → [reference.md](reference.md).

## Golden rule: MCP only

**All Archsphere reads and writes go through MCP** (`CallMcpTool` on `user-archsphere` / `archsphere`). Do **not** call Integration API endpoints, `curl`, or `fetch` with keys from config — see `.cursor/rules/mcp-credentials.mdc`.

If a tool is missing or auth fails: report it, ask the user to restart or re-authenticate MCP, and **stop**. Do not bypass with direct HTTP.

## Golden rule: catalog first

Before creating or updating anything that references a **domain** or **participant** (or skill subitems / impact ids for results):

1. **MCP:** call `get_workspace_catalog`

Use catalog ids/labels — do not invent participant UUIDs or domain strings from user text alone.

`list_participants` is optional name search only; prefer the catalog for authoritative ids.

## Rich payloads: fill every applicable field

**Do not create bare-minimum records** (e.g. project with only `name`). Before any write:

1. Load catalog (`get_workspace_catalog`).
2. Infer what you can from the user message and existing projects/tasks.
3. **Ask targeted follow-up questions** for anything still unknown that affects quality.
4. Send the **fullest valid payload** the MCP tool accepts.

Only skip a field when the user explicitly says to leave it empty or it truly does not apply.

Use short, grouped questions — not one field per message. Propose sensible defaults (e.g. `status: not_started`, `tshirtSize: M`, `criticality: medium`, `currentStep: "6 - Parking lot"`) and confirm only when uncertain.

Field-level guidance: [reference.md](reference.md).

### Eisenhower v2 prioritization (default framework)

Archsphere uses **Eisenhower v2 only** (`prioritizationTools: ["eisenhower"]`). On every **new project**, ask the user to rate all eight indicators (1 = minimal … 5 = very high) unless they explicitly skip prioritization.

Send `eisenhowerFactors` on create. The server computes `priorityScore` (0–100), sets `prioritizationTools`, and stores `dynamicData.prioritization.eisenhowerV2`.

Ask in one grouped message (impact block + urgency block). Propose defaults only when the user wants to defer scoring — do not invent ratings.

### WBS (`wbsStages`) — keep it simple

**Purpose:** the WBS must be **followed and updated in practice**. Prefer **few, coarse milestones** over detailed task mirrors.

#### Design rules (mandatory)

Canonical numeric targets live in `archsphere/src/lib/projects/aiPrompts/wbsDesignRules.ts` (keep in sync with this table).

| Rule | Target |
|------|--------|
| Level-1 phases | **2–4** per project (hard max **5** only if user explicitly asks) |
| Children per phase | **≥ 1 required** — progress % from children only; empty `children: []` reports **100% done** incorrectly |
| Deliverables per phase | **2–5** coarse milestones (hard max **6**) |
| Total children | Prefer **≤ 12** across the whole project |
| Title style | Short, outcome-oriented — *what was achieved*, not micro-steps |
| **Generic phases (default)** | Discovery → Specification (TO BE) → Build & validation |
| **Specialization** | UI, API, database, migrations → **project tasks** and **WBS artifacts** — not WBS child titles |
| Task list → WBS | **Consolidate** tasks into outcome milestones; never 1:1 map every task |
| Dates | Within project window — see below; omit rather than guess |
| **Project completion** | Before `status: completed`, **every WBS child** must be `itemStatus: done` |

#### Completing or closing a project (WBS gate)

Archsphere validates the **full project list** on save. A completed project with pending WBS children blocks saving **other** projects until fixed.

**Before** setting `status: completed` and `completionDate`:

1. `get_project` → inspect all `wbsStages[].children`
2. If any child is still `pending`: mark `done` or **trim** WBS to delivered scope first
3. Set each phase `completionDate` when all its children are `done`
4. **MCP:** call `complete_project` — do **not** send `status: completed` on `update_project`
5. Follow **Results on completion** for the responsible participant

#### WBS dates vs project schedule (mandatory)

When the project has `startDate` and/or `targetDate`, **every WBS date** must stay inside that window. Violations block the whole workspace list.

**Agent checklist:** read project dates first; extend project `targetDate` before assigning a later WBS target; leave WBS dates empty if timeline is unknown.

#### When to create or change WBS

**Template first, AI prompt second (mandatory order):**

1. **`get_project`** — do not regenerate existing WBS unless user asks
2. **`list_wbs_templates`** — apply matching template before AI prompt
3. **Only when no template applies:** `get_project_description_wbs_prompt` → YAML → import
4. **After good AI WBS** on repeatable type → `upsert_wbs_template`

| Situation | Action |
|-----------|--------|
| Project already has WBS | Keep or trim; no AI regeneration |
| Matching workspace template exists | Apply template (`wbsTemplateId` + cloned `wbsStages`) |
| No template, user wants WBS | AI prompt → YAML → import |
| Repeatable pattern | Save as template after first success |

Generate UUIDs for new stage/item ids (`crypto.randomUUID()`).

#### Stage colors (light theme)

WBS `color` is for **text on light background** — use **dark, saturated hex**. Never light pastels/neons.

**Palette:** `#2563eb` · `#7c3aed` · `#059669` · `#0f766e` · `#c2410c` · `#be185d` · `#4338ca`

JSON examples: [reference.md](reference.md).

### WBS artifacts (generated deliverables)

Store **full markdown** outputs linked to a **WBS child** — not only a logbook summary.

| Field | Guidance |
|-------|----------|
| `wbsPhaseId` / `wbsChildId` | UUIDs from current project WBS |
| `title` | Human-readable artifact name |
| `kind` | `business_architecture` \| `solution_architecture` \| `other` |
| `format` | Always `markdown` |
| `content` | **Full document** — not an excerpt |
| `generatedAt` | ISO date `YYYY-MM-DD` |

**Before upsert:** always `get_project` and edit **current server** `content`. Never replace from a stale local copy.

**MCP:** `upsert_wbs_artifact` (preferred). **UI:** Project detail → **Artifacts** tab.

Logbook entries remain **summaries**; artifacts hold the **integral** document.

### Lifecycle actions (MCP only)

**Never** change project `status` or task `status`/`kind` through generic PATCH — use named lifecycle MCP tools (same rules as the UI).

| Intent | MCP tool |
|--------|----------|
| Start project | `start_project` |
| Park project | `park_project` |
| Complete project | `complete_project` |
| Cancel project | `cancel_project` |
| Reopen project | `reopen_project` |
| Deploy / implant task | `implant_task` |
| Complete default task | `complete_task` |
| Dismiss incident | `dismiss_task_incident` |
| Reopen task | `reopen_task` |
| Register incident | `register_task_incident` |

Metadata (name, description, dates, WBS, logbook) still uses `update_project` / `update_task`.

### DORA deploy tasks (`kind: deploy`)

**Decision D9:** deploy rotineiro = **`kind: deploy`**. Each completed deploy task counts **+1 entrega** na DF.

| Phase | When | Action |
|-------|------|--------|
| **1 — Open** | User requests production code change | `create_task` **`kind: deploy`**, **`status: pending`** |
| **2 — Complete** | User asks for **push** and `git push` succeeds ([git-commit](../git-commit/SKILL.md)) | **`implant_task`** — not `update_task` with `status: completed` |

**Skip phase 1** only for: question-only, review-only, or user says work will not deploy.

**Track `deployTaskId`** in the session after phase 1. On push, complete that task — **do not** create a second deploy task for the same delivery.

**Phase 1:** resolve target project → if no `deployDate`, implant first → `create_task` with `kind: deploy`, `status: pending`, `createdAt: today`, store `task.id` as `deployTaskId`.

**Phase 2:** read pushed commit → resolve task via `deployTaskId` or newest pending `kind: deploy` → optional metadata patch → **`implant_task`**.

**LTFC:** lead time = phase 1 `createdAt` → phase 2 `completionDate`.

**Pré-condição:** `kind: deploy` exige projeto com `productId` + `deployDate`.

**Default sustentação mensal:**

| Constant | Value |
|----------|--------|
| Name pattern | `Archsphere — sustentação YYYY-MM` |
| Jul/2026 project ID | `573de5f6-9763-4d95-8946-fc99aeb55fd3` |
| Responsible (deploy tasks) | Cursor (`91de0e5e-f309-41e0-b484-a97d4e4a124a`) |

**Resolver projeto alvo:** prefer feature project related to the work → hotfix on same feature project as `incident` → sustentação mensal as fallback.

**When to run phase 1:** before editing files when user requests production code changes.  
**When to run phase 2:** after successful push ([git-commit](../git-commit/SKILL.md)).

**Semantics (D11):** project implantation is not a delivery; only completed `deploy`/`incident` tasks count for DF/CFR.

**Do not** complete deploy tasks for failed pushes. **Do not** leave pending deploy tasks open after successful push.

Payload examples: [reference.md](reference.md).

### DORA incident tasks (`kind: incident`)

Production hotfix counts as **redeploy + CFR failure**. MTTR = fix work started → push to production.

**Always set `recoveryStartedAt` and `completedAt`.** Do not rely on task registration time.

Infer push time from `git log -1 --format=%cI` when the agent just pushed. Ask the user when fix work started if unclear.

### Results on completion (mandatory)

Whenever a **project**, **project task**, or **standalone task** is marked completed, **also create a participant result** for whoever was responsible.

| Trigger | Result for | Context |
|---------|------------|---------|
| Project → completed / cancelled with value | `responsibleParticipantId` | `contextType: project` |
| Project task → completed | `responsibleParticipantId` | `contextType: project_task` |
| Standalone task → completed | `responsibleParticipantId` | `contextType: standalone_task` |

Skip only when user opts out or work was trivial.

#### Evidence to gather (before `create_result`)

1. `get_workspace_catalog` — skills, impacts
2. `get_project` → objective, WBS, prioritization
3. **Logbook** — all entries (primary source for impact)
4. **Tasks** — names, descriptions, dates
5. **Existing results** — do not duplicate

Infer 2–4 positive `skillBehaviors` with evidence; add negative only for clear learning moments. Pick `impactTypeIds` / `essenceIds` from catalog.

#### Agent workflow

**Project:** WBS gate → `append_logbook_entry` if needed → **`complete_project`** → `create_result` → confirm.

**Task:** update with `completionDate` → mark WBS child `done` → `create_result` → confirm.

Example payload: [reference.md](reference.md).

### Agent workflow (create / update)

1. `get_workspace_catalog`
2. Parse request; list **missing** fields; ask in one batch
3. **WBS path:** `list_wbs_templates` → template or AI prompt → import
4. `create_project` / `update_project` with **full** body
5. If tasks discussed → `create_task` with descriptions and dates
6. Status notes → `append_logbook_entry` (never replace logbook on PATCH)

**Artifact + logbook workflow (mandatory):**

1. `upsert_wbs_artifact` only — **no** `logbook` in the same call
2. `append_logbook_entry` with one-line summary
3. Never PATCH `logbook.entries` from memory

When status → completed → **Results on completion** + **WBS gate** for projects.

### Logbook (append-only history)

**Never replace the logbook** on routine updates. MCP `update_project` rejects `logbook.entries`.

| Do | Don't |
|----|--------|
| `append_logbook_entry` per event | Re-send `logbook.entries` with only the latest line |
| One entry per event | `update_logbook_entry` to "refresh" new progress |

**MCP:** `append_logbook_entry` with `{ projectId, date, description, noUpdates? }`.

## Destructive operations (delete)

**Never delete on guess.** Fetch the record, verify id + name/title (+ project for tasks). If ambiguous → ask. Only then delete.

| Resource | Extra checks |
|----------|----------------|
| Project | Delete only when `status === not_started` |
| Task | Confirm belongs to intended project |
| Logbook entry | Confirm `date` + description snippet |
| Result | Confirm participant + title |

## Agent artifacts catalog (rules & skills distribution)

Read-only via MCP:

| Tool | Use |
|------|-----|
| `list_agent_artifacts` | Browse slugs; filter `kind`, `category`, `query` |
| `get_agent_artifact` | Full markdown for one rule/skill by slug |

Packages **delivery** vs **optional** and rule↔skill map: [agent-artifacts-documentation/arqueosfera-distribution-manifest.md](../agent-artifacts-documentation/arqueosfera-distribution-manifest.md).

Use when installing agent config into a client project or answering “which skills ship with Arqueosfera?” — not for participant skill scores (those are in `get_workspace_catalog`).

**Refresh catalog text from repo bundle:** MCP `import_agent_artifacts` with `refreshFromRepoBundle: true`, `updateExisting: true` (reads local `bundledAgentArtifacts.json` — restart MCP after updating archsphere-mcp). Server-only fallback: `useBundled: true` after deploy.

## Rules (summary)

- **WBS dates** within project window; extend project target before later WBS targets
- **WBS gate** before project completion; partial closure → trim WBS first
- **Results on completion** for responsible participant unless user opts out
- **Maximize fields** on writes — except WBS (keep minimal)
- **Template before AI WBS:** `list_wbs_templates` first
- **WBS children required** on every level-1 phase
- **WBS colors:** dark saturated hex on light UI
- **New projects:** default `currentStep: "6 - Parking lot"`
- **Verify before delete**
- **MCP only** for all Archsphere operations — see `.cursor/rules/mcp-credentials.mdc`
- Verify ids in catalog before writes; on auth/scope errors ask user to restart MCP or update the key
- Do not commit API keys

## Triggers

archsphere MCP, arqueosfera MCP, create project via MCP, participant results, logbook, skill scores, get_workspace_catalog, list_agent_artifacts
