# Delivery reviewer — examples

## Example 1 — WBS artifacts UI (revise)

**Context:** Feature added CRUD + markdown modal; user asked if skills were applied.

### Skill coverage

| Skill | Expected | Applied | Gap |
|-------|----------|---------|-----|
| PM | Yes | No | No written AC |
| UX | Yes | Partial | No click budget doc |
| security-architecture | Yes | No | Markdown XSS not assessed pre-ship |
| software-development | Yes | Yes | OK |
| qa-testing | Yes | Partial | lib tests only; no panel tests |

**Verdict:** Revise  
**Proposal quality:** Viable with revisions

### Findings

| ID | Lane | Sev | Finding | Action |
|----|------|-----|---------|--------|
| REV-001 | PM | Medium | No testable acceptance criteria | Re-run PM — 5 AC bullets |
| REV-002 | UX | Low | Modal OK but click budget not documented | Add UX note: view = 1 click |
| REV-003 | Security | High | Markdown render — verify sanitize | Re-run security-architecture |
| REV-004 | QA | Medium | No `ProjectWbsArtifactsPanel.test.tsx` | qa-testing — add component tests |

### Better alternative

None on architecture — reusing `ProjectLinksPanel` pattern was appropriate. Gap is **process**, not design.

---

## Example 2 — Parser bugfix (approve)

**Context:** One-line guard clause fix + unit test.

| Skill | Expected | Applied |
|-------|----------|---------|
| software-development | Yes | Yes |
| qa-testing | Yes | Yes |
| PM, UX, arch | N/A | N/A |

**Verdict:** Approve  
**Proposal quality:** Best reasonable

---

## Example 3 — New MCP tool (block)

**Context:** New `export_all_secrets` tool added without security review.

| ID | Lane | Sev | Finding |
|----|------|-----|---------|
| REV-001 | skill-routing | Critical | security-architecture skipped |
| REV-002 | Security | Critical | Tool returns unredacted env |
| REV-003 | QA | High | No exfiltration tests |

**Verdict:** Block  
**Better alternative:** Read-only scoped tools + redaction per `archsphere-mcp/src/security.ts`.

---

## Example 4 — Parecer duration (approve with note)

**Context:** Business + solution pareceres, WBS artifacts, logbook — dispute case.

| Lane | Score | Note |
|------|-------|------|
| business-architecture | Strong | Segmented ownership clear |
| solution-architecture | Strong | Options + recommendation |
| archsphere-integration | Strong | Full markdown artifacts |
| delivery-reviewer | — | PM/UX N/A for analysis-only ask |

**Verdict:** Approve for decision use  
**Note:** Implementation of recommendation is a **new** request — run full chain when building.

---

## Short review format (user asked “está bom?”)

```markdown
## Delivery review — {feature}

**Verdict:** Revise  
**Proposal quality:** Viable with revisions

**Summary:** Implementation matches app patterns, but PM and security lanes were skipped for a user-facing feature.

**Skipped skills:** product-management, security-architecture

**Top 3 actions:**
1. Write 5 acceptance criteria (PM)
2. Threat model markdown modal (security-architecture)
3. Add panel tests (qa-testing)
```
