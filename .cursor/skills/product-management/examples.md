# Examples — Product Management

---

## A — New feature on existing project

**User request:** "Especificar e registrar histórias para aba Artefatos no Archsphere."

### Frame

| Item | Value |
|------|-------|
| Outcome | PM/dev teams can trace markdown deliverables to WBS |
| Users | Architect, PM viewing project detail |
| Project | Existing `[Arquitetura] …` or platform project |

### Stories → tasks

| Story | Task name | Criticality |
|-------|-----------|-------------|
| US-1 Ver lista de artefatos por item WBS | View WBS artifacts list on project tab | medium |
| US-2 Baixar markdown do artefato | Download artifact as .md file | low |
| US-3 Registrar artefato via API/MCP | Upsert WBS artifact via integration | high |

### Task description snippet (US-1)

```markdown
## User story
Como arquiteto, quero ver os artefatos vinculados a itens da WBS, para consultar pareceres completos sem buscar no logbook.

## Acceptance criteria
- [ ] Dado um projeto com artefatos em dynamicData, quando abro a aba Artefatos, então vejo cards com título, tipo, data e vínculo WBS.
- [ ] Dado projeto sem artefatos, quando abro a aba, então vejo estado vazio orientado.

## References
- FR-1, FR-2
```

### Archsphere actions

1. `list_projects` → resolve project id  
2. `list_project_tasks` → avoid duplicates  
3. `create_task` × 3 with full descriptions  
4. Logbook: "Backlog feature Artefatos WBS — 3 histórias registradas."

---

## B — New initiative → new project + stories

**User request:** "Nova funcionalidade de priorização automática por IA."

### When to create project

New domain initiative, no matching project → `create_project` with objective, domain, Eisenhower factors (ask user), then tasks.

### Story split (avoid one mega-task)

| Too big | Split into |
|---------|------------|
| "IA prioriza projetos" | US-1 Definir inputs/score explícito; US-2 Sugestão explicável na UI; US-3 Opt-in por workspace |

---

## C — Handoff to architecture

**Signal:** User story depends on ownership dispute or ADR.

**PM action:** Mark story as blocked in description; run [business-architecture](../business-architecture/SKILL.md) before implementation stories.

```markdown
## Notes
Blocked until business architecture assessment for duration ownership (see project X logbook).
```

---

## Checklist (any feature)

- [ ] Feature spec with FR ids  
- [ ] Each story has ≥2 acceptance criteria  
- [ ] Catalog loaded before task create  
- [ ] No duplicate tasks on project  
- [ ] User receives story ↔ task mapping table
