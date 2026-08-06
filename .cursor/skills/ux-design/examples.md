# Examples — UX Design

---

## A — New tab (Archsphere Artifacts)

**Trigger:** PM story "Ver artefatos WBS no projeto".

### UX decisions

| Topic | Choice | Rationale |
|-------|--------|-----------|
| Placement | Tab after Stages | Same mental model as Logbook — **no extra route** |
| Clicks to read artifact | **2** (open tab → expand card) | Content hidden by default keeps list scannable |
| Empty state | Hint text only | No fake CTA — artifacts created via MCP/API |
| Primary action | Expand markdown | Download secondary — read before export |
| Aesthetics | Match `ProjectDetailTabs` + logbook list | Same tab pills, card border, ghost buttons |
| Mobile | Reuse tab swipe | Consistent with existing project detail |

### State table (SCR-1)

| State | UI |
|-------|-----|
| Empty | `wbsArtifactsEmpty` i18n string |
| Has items | Cards with title, kind, date, WBS breadcrumb |
| Expanded | `<pre>` scrollable monospace block |

### Dev handoff snippet

```markdown
## UX specification
- Tab pill count = artifact length (see ProjectDetailTabs pattern)
- Card header: title + kind + date + phase → child
- Actions: ghost "Download .md", ghost "Ver/Ocultar"
- a11y: `role="list"` on container, `aria-expanded` on toggle
```

---

## B — When to use canvas prototype

**Use canvas when:** new multi-step wizard with branching validation — stakeholder must click through.

**Skip canvas when:** adding one button to existing row — wireframe in spec is enough.

---

## C — Chained skills (typical feature)

```
1. product-management → feature spec + stories + create_task
2. ux-design → ux-spec + optional canvas + update task descriptions with UX § refs
3. dev implements using ux-spec-template sections
4. solution-architecture → only if integration/API dispute
```

---

## Checklist

- [ ] Click budget documented and within target  
- [ ] Navigation ≤2 levels for primary task  
- [ ] Visual reference to existing app screens named  
- [ ] Every screen has empty + loading + error  
- [ ] Copy deck complete — no placeholders  
- [ ] Primary action obvious per screen  
- [ ] Existing Archsphere patterns referenced  
- [ ] UX AC added to PM tasks or WBS artifact  
- [ ] Prototype linked if created
