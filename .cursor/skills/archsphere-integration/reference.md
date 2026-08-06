# Archsphere Integration — MCP reference

Read this file when you need field checklists, MCP tool tables, or JSON examples. Workflows and golden rules stay in [SKILL.md](SKILL.md).

**Cursor agents:** use **MCP tools only** (`CallMcpTool` on `user-archsphere` / `archsphere`). Do not call Integration API endpoints or extract keys from config. The REST section at the bottom is for humans maintaining scripts outside the agent — not for agent use.

## MCP setup

Published npm package: **`@arqueosfera/mcp`**.

```json
{
  "mcpServers": {
    "archsphere": {
      "command": "npx",
      "args": ["-y", "@arqueosfera/mcp"],
      "env": {
        "ARCHSPHERE_API_KEY": "as_live_…",
        "ARCHSPHERE_BASE_URL": "https://arqueosfera.com"
      }
    }
  }
}
```

Monorepo local development (without npm):

```json
{
  "mcpServers": {
    "archsphere": {
      "command": "node",
      "args": ["/absolute/path/to/archsphere/archsphere-mcp/dist/index.js"],
      "env": {
        "ARCHSPHERE_API_KEY": "as_live_…",
        "ARCHSPHERE_BASE_URL": "https://arqueosfera.com"
      }
    }
  }
}
```

| Env var | Purpose |
|---------|---------|
| `ARCHSPHERE_API_KEY` | Workspace-scoped key (used by MCP server only) |
| `ARCHSPHERE_BASE_URL` | `https://arqueosfera.com` or `http://localhost:3100` |

## Catalog response (`get_workspace_catalog`)

| Field | Use |
|-------|-----|
| `domains` | `{ id, label }` — domain is free text; reuse existing `label` or pick from list |
| `participants` | `{ id, name, role, department }` — assign requester/responsible |
| `skillCategories[].subitems` | Skill behavior `subitemId` in results; skill score `subitemId` |
| `executionImpactTypes` / `executionImpactEssences` | Result `impactTypeIds` / `essenceIds` |
| `projectStatuses`, `taskStatuses`, `logbookFrequencies`, `resultContextTypes`, `skillScoreLevels` | Enums |

## Scopes

| Scope | Resources |
|-------|-----------|
| `catalog:read` | Workspace catalog |
| `projects:read` / `projects:write` | Projects |
| `tasks:read` / `tasks:write` | Project tasks + standalone tasks |
| `logbook:read` / `logbook:write` | Status logbook |
| `results:read` / `results:write` | Participant results |
| `skills:read` / `skills:write` | Participant skill scores |

Recreate API keys after scope changes if using custom scope sets.

## Field checklists

### When to ask the user

| Intent | Ask if missing |
|--------|----------------|
| New project | Objective, domain, status, tshirt size, criticality, requester/responsible (names → match catalog), start/target dates, links, logbook cadence, **Eisenhower v2 factors (8 ratings 1–5)**. For `currentStep`, default to `"6 - Parking lot"` unless the user states another step. For WBS: only ask if the user wants phases; otherwise propose 2–4 coarse stages yourself |
| New project task | Description, responsible, target/completion dates, status, criticality |
| Standalone task | Description, requester/responsible, dates, status, criticality |
| Result | Participant, context (project/task/event), occurred date, notes, skill behaviors (subitem + polarity + note), impact types, essences — on completion, infer from logbook/tasks unless user skips |
| Skill scores | Which subitems to assess, score 1–6, examples, positive/development points |
| Logbook | Cadence (weekly/biweekly/monthly), first entry date and description |

### Project fields

| Field | Guidance |
|-------|----------|
| `name` | Required |
| `objective` | Multi-sentence goal; ask user to elaborate |
| `status` | Default `not_started` for new work |
| `domain` | From catalog labels or new label user confirms |
| `tshirtSize` | `XS`–`XXXL`; ask size/complexity if unclear |
| `criticality` | `low` \| `medium` \| `high` \| `critical` |
| `requesterParticipantId` / `responsibleParticipantId` | Resolve names via catalog |
| `startDate` / `targetDate` | ISO `YYYY-MM-DD`; ask timeline |
| `completionDate` | Only if status is `completed` or `cancelled` |
| `currentStep` | On **create:** default `"6 - Parking lot"` when unknown |
| `wbsStages` | See WBS in SKILL.md |
| `links` | Useful URLs (docs, repo, drive) |
| `logbook` | `{ frequency, entries[] }` on **create only** |
| `priorityScore` / `prioritizationTools` | Set automatically when `eisenhowerFactors` is sent |
| `eisenhowerFactors` | **Preferred on create:** eight integers 1–5 |
| `prioritization` | Raw snapshot merge; use only when not sending `eisenhowerFactors` |
| `position` | When ordering matters in board |

### Eisenhower v2 factors

| Field | Meaning |
|-------|---------|
| `businessImpact` | Strategic outcomes and customer value |
| `financialImpact` | Savings, revenue, or losses avoided |
| `technologicalImpact` | Architecture, platform, technical health |
| `regulatoryRisk` | Compliance, legal exposure, consequence of inaction |
| `deadline` | Time pressure from committed dates |
| `organizationalTemperature` | Operational pressure and noise around the demand |
| `dependenciesBlockers` | Cross-team dependencies and blockers |
| `opportunityWindow` | How narrow the value window is |

Example fragment:

```json
{
  "name": "Platform migration",
  "objective": "Migrate core services to the new cluster.",
  "currentStep": "6 - Parking lot",
  "eisenhowerFactors": {
    "businessImpact": 4,
    "financialImpact": 3,
    "technologicalImpact": 5,
    "regulatoryRisk": 2,
    "deadline": 4,
    "organizationalTemperature": 3,
    "dependenciesBlockers": 2,
    "opportunityWindow": 3
  }
}
```

### Task fields

| Field | Guidance |
|-------|----------|
| `name` / `taskName` | Required |
| `description` | Always ask or draft from context |
| `status` | `pending` default; `completed` only if done |
| `createdAt` | Today ISO date if not specified |
| `targetDate` / `completionDate` | Ask deadline |
| `responsibleParticipantId` | Catalog lookup |
| `requesterParticipantId` | Standalone tasks — catalog lookup |
| `criticality` | Ask if task is urgent/blocking |
| `position` | Order within list when relevant |
| `kind` | `default` \| `incident` \| **`deploy`** (DORA). Legacy tasks without `kind` = `default` |

### Result fields

Minimum API rule: ≥1 `skillBehavior`. Also fill:

- `title`, `notes`, `occurredAt` (ISO datetime)
- `contextType` + matching context id
- `skillBehaviors[]`: `{ id, subitemId, polarity: positive|negative, note }`
- `impactTypeIds[]`, `essenceIds[]` from catalog when user describes impact

### Skill scores

Per subitem: `score` (1–6), `examples`, `positivePoints`, `developmentPoints`, `reviewedAt` (now ISO).

## JSON examples

### WBS phase (good)

```json
{
  "id": "<uuid>",
  "title": "Specification (TO BE)",
  "color": "#7c3aed",
  "startDate": "2026-08-01",
  "targetDate": "2026-08-31",
  "completionDate": "",
  "children": [
    {
      "id": "<uuid>",
      "title": "TO BE specification approved",
      "itemStatus": "pending",
      "startDate": "",
      "targetDate": "",
      "completionDate": ""
    }
  ]
}
```

### WBS artifact

```json
{
  "projectId": "<uuid>",
  "wbsPhaseId": "<phase-uuid>",
  "wbsChildId": "<child-uuid>",
  "title": "Solution architecture opinion — topic X",
  "kind": "solution_architecture",
  "content": "# Parecer\\n\\n…full markdown…",
  "generatedAt": "2026-07-25"
}
```

### DORA deploy — phase 1 (open pending)

```json
{
  "kind": "deploy",
  "status": "pending",
  "name": "Deploy: LTFC review status filter on artifacts",
  "createdAt": "2026-07-26",
  "description": "User requested artifact list filter by pending vs all review status."
}
```

### DORA deploy — phase 2 (`implant_task`)

```json
{
  "projectId": "<project-uuid>",
  "taskId": "<deployTaskId from phase 1>"
}
```

### DORA incident

```json
{
  "kind": "incident",
  "status": "completed",
  "name": "Hotfix: DORA tab cache",
  "description": "Fix reload on every tab click. Commit abc123.",
  "createdAt": "2026-07-26",
  "completionDate": "2026-07-26",
  "recoveryStartedAt": "2026-07-26T18:30:00.000Z",
  "completedAt": "2026-07-26T21:15:00.000Z"
}
```

### Result on task completion

```json
{
  "result": {
    "participantId": "<responsible-from-catalog>",
    "title": "Reprocessing model aligned — tactical path for regulatory deadline",
    "notes": "Facilitated technical session with custody and finance.",
    "contextType": "project_task",
    "contextProjectId": "<project-uuid>",
    "contextProjectTaskId": "<task-uuid>",
    "occurredAt": "2026-07-23T12:00:00.000Z",
    "skillBehaviors": [
      {
        "id": "<uuid>",
        "subitemId": "<facilitation-subitem-from-catalog>",
        "polarity": "positive",
        "note": "Ran cross-team session; converged custody and finance"
      }
    ],
    "impactTypeIds": ["<impact-from-catalog>"],
    "essenceIds": ["<essence-from-catalog>"]
  }
}
```

## REST endpoints (humans / CI only — not for agents)

Integration API v1 exists for scripts, CI, and external integrations run **by humans**. **Cursor agents must not call these endpoints** — use MCP tools above instead.

```http
Authorization: Bearer as_live_…
Accept: application/json
```

Production: `https://arqueosfera.com` · Local: `http://localhost:3100`

### Catalog
- `GET /api/v1/catalog`
- `GET /api/v1/agent-artifacts` — list Cursor rules/skills (`catalog:read`; query `kind`, `category`, `query`)
- `GET /api/v1/agent-artifacts/:slug` — full catalog entry with markdown documentation (`catalog:read`)

Agent artifacts distribution (delivery / optional packages, rule↔skill map): `.cursor/skills/agent-artifacts-documentation/arqueosfera-distribution-manifest.md`

### Projects
- `GET/POST /api/v1/projects`
- `GET/PATCH/DELETE /api/v1/projects/:projectId`
- `GET /api/v1/wbs-templates` — list workspace WBS templates (`projects:read`)
- `POST /api/v1/wbs-templates` — upsert one template (`projects:write`, body `{ template }`)
- `GET /api/v1/projects/:projectId/prompts/description-wbs?locale=en|pt`
- `GET /api/v1/projects/:projectId/prompts/performance?locale=en|pt`

Project fields: `name`, `status`, `domain`, `tshirtSize`, `criticality`, participant ids, `currentStep`, `wbsTemplateId`, `wbsStages`, `objective`, dates, `priorityScore`, `prioritizationTools`, `links`, `logbook`, `prioritization`, `position`.

Delete only when `status === not_started`.

### Project tasks
- `GET/POST /api/v1/projects/:projectId/tasks`
- `GET/PATCH/DELETE /api/v1/tasks/:taskId`

### Standalone tasks
- `GET/POST /api/v1/standalone-tasks`
- `GET/PATCH/DELETE /api/v1/standalone-tasks/:taskId`

### Logbook
- `GET/PATCH /api/v1/projects/:projectId/logbook`
- `POST /api/v1/projects/:projectId/logbook/entries`
- `PATCH/DELETE /api/v1/projects/:projectId/logbook/entries/:date`

### Results
- `GET/POST /api/v1/results` · `GET/PATCH/DELETE /api/v1/results/:resultId`

Body: `{ result: { participantId, title, notes, contextType, context ids, occurredAt, skillBehaviors[], impactTypeIds[], essenceIds[] } }`

### Skill scores
- `GET/PUT /api/v1/participants/:participantId/skill-scores`

### Mood state and communication profile (DISC)
- `GET/PUT /api/v1/participants/:participantId/mood-state`
- `GET/PUT /api/v1/participants/:participantId/communication-profile`

### Participants (search)
- `GET /api/v1/participants?search=` — scope `projects:read`

## MCP tools (primary interface)

Call via `CallMcpTool` — **always prefer these over REST** in Cursor.

| Tool | Notes |
|------|-------|
| `get_workspace_catalog` | **Call first** for domains, participants, skills, enums |
| `get_project` | Full project payload |
| `list_wbs_templates` | **Call before AI WBS** |
| `list_agent_artifacts` | Browse Cursor rules/skills catalog (filter by kind, category, query) |
| `get_agent_artifact` | Full markdown doc for one rule/skill by slug |
| `upsert_wbs_template` | Persist validated WBS structure |
| `get_project_description_wbs_prompt` | Only after `list_wbs_templates` shows no fit |
| `get_project_performance_prompt` | Participant performance prompt for manual result drafts |
| `create_project` / `update_project` | Never `logbook.entries` on update |
| `append_logbook_entry` | **Primary** — one call per status event |
| `update_logbook_entry` | Typo fix on existing line only |
| `update_logbook_frequency` | Cadence change only |
| `create_task` / `update_task` | Catalog first for participant ids |
| `create_standalone_task` / `update_standalone_task` | Catalog first |
| `create_result` / `update_result` | Catalog first |
| `update_participant_skill_scores` | Catalog first |
| `get_participant_mood_state` / `update_participant_mood_state` | Pass `null` to clear |
| `get_participant_communication_profile` / `update_participant_communication_profile` | Pass `null` to clear |
| `list_participants` | Search only; catalog preferred |

Lifecycle tools: `start_project`, `park_project`, `complete_project`, `cancel_project`, `reopen_project`, `implant_task`, `complete_task`, `dismiss_task_incident`, `reopen_task`, `register_task_incident`.

Full list: `archsphere-mcp/src/index.ts`.

## Typical flows

### Create project with responsible
1. `get_workspace_catalog` → participants, domains
2. Ask user for objective, dates, size, criticality if not provided
3. `create_project` with full payload — `currentStep: "6 - Parking lot"` when unclear
4. Optionally `create_task` + logbook entry

### Record a result
1. Catalog → participant, skills, impacts
2. Gather logbook + tasks + user context (see SKILL.md **Results on completion**)
3. `create_result` with full `result` object

### Complete project or task
1. **Project — WBS gate:** all children `done`
2. Update status; mark matching WBS child when applicable
3. Append logbook when user gave a status narrative
4. **Results on completion** → `create_result`
5. Confirm to user

### Update skill assessment
1. Catalog → participant + subitem ids
2. `update_participant_skill_scores`
