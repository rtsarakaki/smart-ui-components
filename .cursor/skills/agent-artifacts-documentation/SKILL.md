---
name: agent-artifacts-documentation
description: >-
  Generate catalog markdown for Cursor agent rules (.mdc) and skills (SKILL.md)
  including purpose, section index with summaries, optional Mermaid diagrams,
  dependencies, templates, and full source code. Use when documenting rules/skills
  for the Archsphere agent artifacts catalog, importing .cursor artifacts, or
  writing catalog entries with code and docs.
---

# Agent artifacts documentation

Produce **catalog-ready markdown** for each Cursor **rule** (`.mdc`) or **skill** (`SKILL.md`) so workspace owners can browse, filter, and edit them in Archsphere settings.

## When to apply

| Trigger | Action |
|---------|--------|
| New rule or skill added under `.cursor/` | Generate or refresh catalog entry |
| User asks to document rules/skills catalog | Follow workflow below |
| Import repo artifacts into catalog | Build docs then MCP `import_agent_artifacts` |

Keywords: catálogo de rules, catálogo de skills, agent artifacts, documentação de rule, documentação de skill.

## Workflow

```
- [ ] 1. Read the source file(s) — SKILL.md, .mdc, linked templates
- [ ] 2. Classify kind (rule | skill) and pick category
- [ ] 3. Write **Para que serve** — o que o agente passa a fazer (comportamento), não rótulo genérico de categoria
- [ ] 4. Extract dependencies from links and "Relationship" tables
- [ ] 5. List template/support files the artifact needs
- [ ] 6. Build **Índice do conteúdo**: `| Seção | Por que existe |` — motivo em PT por `##` / `###`
- [ ] 7. Add **Visão geral (diagrama)** Mermaid (rótulos PT) when workflow, handoffs, deps, or ≥3 H2 sections
- [ ] 8. Embed full source in **Código-fonte** (fenced `markdown`, with frontmatter)
- [ ] 9. Regenerate bundle + refresh catalog (see Import helper)
```

## Para que serve (obrigatório — comportamento, não categoria)

The **Para que serve** section answers: *what does the agent do differently when this artifact is loaded?*

### Must do

- **1–3 sentences in Portuguese** summarizing **behavior**, constraints, and tools/APIs when relevant.
- Name **concrete actions** (e.g. `append_logbook_entry`, guard clauses, MCP-only writes).
- For **short rules** without `##` headings, put the numbered list / opening paragraph here — that *is* the purpose.

### Must not do

| Anti-pattern | Why |
|--------------|-----|
| `Rule Cursor sempre aplicada ou sob demanda para orientar o agente em integration & mcp.` | Says category, not behavior |
| `Skill de playbook que o agente carrega quando a tarefa se encaixa em delivery chain.` | Same — no actionable detail |
| Copy-paste English from source | Wrapper is PT; source stays in Código-fonte |

### Good examples

**Rule `archsphere-logbook`:**

> Preserva o histórico do projeto sem apagar entradas anteriores. Ao atualizar projetos via MCP ou Integration API: **append** com `append_logbook_entry` (uma chamada por evento); **nunca** envie `logbook.entries` em `update_project`; **nunca** use `update_logbook_entry` para progresso novo — só typo; após `upsert_wbs_artifact`, chame `append_logbook_entry` em passo separado com resumo de uma linha.

**Skill `archsphere-integration`:**

> Playbook para operar o Archsphere exclusivamente via MCP: projetos, tarefas, logbook, WBS, artefatos, results e DORA. Carregue quando o agente precisar ler ou gravar no workspace sem contornar credenciais.

**Rule `clean-code` (fallback acceptable when sections carry detail):**

> Orienta nomes descritivos, guard clauses (sem else), imutabilidade e funções puras em TypeScript/React — reduz código aninhado e efeitos colaterais.

When the generic category fallback is insufficient, add a tailored entry — see **Generator maps** below.

## Section index (Índice do conteúdo)

**Language:** catalog wrapper (metadata, index, distribution, dependencies, templates) in **Portuguese**. **Código-fonte** keeps the artifact's original language (English in this repo).

For every `##` and `###` heading in the source (after frontmatter):

1. **Título localizado** — PT title (`Golden rule: MCP only` → `Regra de ouro: somente MCP`). Stable terms (`MCP`, `WBS`, `guard clauses`) may stay.
2. **Por que existe** — purpose of the section in plain PT. **Do not** copy EN sentences or list technical steps (those stay in Código-fonte).
3. **Table** `| Seção | Por que existe |` — prefix H3 with `↳`.
4. **Intro line:** *Para cada seção, o motivo em português simples — o **porquê** da regra ou orientação, não o passo a passo técnico.*

**Short artifacts** (no `##` / `###`): index line `_Artefato curto sem seções — consulte o código-fonte integral abaixo._` — behavior belongs in **Para que serve**.

### Mermaid (Visão geral)

| Condition | Diagram |
|-----------|---------|
| Workflow / handoff / lifecycle with numbered checklist | `flowchart TD` — `Passo 1`, `Passo 2`, … |
| ≥2 linked dependencies | `flowchart LR` — center = artifact, nodes = deps |
| ≥3 H2 sections, no workflow yet | Sequential overview `flowchart TD` |

Labels in **Portuguese**.

## Distribuição Arqueosfera

Every delivery/optional artifact includes:

- **Pacote:** Pacote delivery (padrão) | Pacote optional (sob demanda)
- Note: catalog via Settings or MCP `list_agent_artifacts` / `get_agent_artifact`
- **Rules e skills relacionadas** table from [arqueosfera-distribution-manifest.md](arqueosfera-distribution-manifest.md)

Platform-only artifacts (e.g. this skill) state they are repo-specific.

## Category guidelines

| Category | Use for |
|----------|---------|
| Coding standards | clean-code, typescript, english-codebase |
| Quality & testing | quality-gates, testing-vitest, qa-testing skill |
| Architecture & design | solution/business/security/design skills and rules |
| Delivery chain | skill-routing, PM, UX, dev, QA, delivery-reviewer |
| Integration & MCP | archsphere-integration, mcp-credentials, API rules |
| Infrastructure | monorepo, supabase migrations/auth, create-project |
| Content & media | content-writing, sem-bala-de-prata |
| Operations | git-commit, linux-disk-cleanup |

## Dependency extraction

- Markdown links to skills (`../other-skill/SKILL.md`) or rules (`*.mdc`)
- Tables: "Relationship", "Handoff", "Related"
- `alwaysApply: true` rules → global dependency for dev work
- Template references (`feature-spec-template.md`, etc.)

Record: **kind** (rule | skill | template), **relationship** (requires, handoff, complements, example).

## Templates section

| File pattern | Label |
|--------------|-------|
| `*-template.md` | Modelo de documento |
| `examples.md` | Exemplos práticos |
| `reference.md` | Referência detalhada |
| Other `.md` in skill folder | Material de apoio |

If none: _Este artefato não referencia templates externos._

## Generator maps (repo maintenance)

Automated docs: `buildAgentArtifactDocumentation` in  
`archsphere/src/lib/agentArtifacts/agentArtifactDocumentation.ts`  
(section index: `agentArtifactSectionIndex.ts`).

When **Para que serve** needs more than the category fallback, add to:

| Map | Kind | Example slugs |
|-----|------|---------------|
| `SKILL_PURPOSE_PT` | skill | `archsphere-integration` |
| `RULE_PURPOSE_PT` | rule | `archsphere-logbook`, `mcp-credentials` |

**When adding a new rule/skill:** if the opening paragraphs or numbered list define unique behavior, add a `RULE_PURPOSE_PT` / `SKILL_PURPOSE_PT` entry in the same PR.

Optional slug-specific section purposes: `SLUG_SECTION_PURPOSE_PT` in `agentArtifactSectionIndex.ts` (e.g. `archsphere-integration`, `mcp-credentials`).

## Output rules

- Catalog wrapper in **Portuguese**; embedded source unchanged
- **Slug** = skill `name` in frontmatter or rule basename without `.mdc`
- **Title** = H1 from artifact
- Keep YAML frontmatter inside Código-fonte fenced block
- Do not use regex flag `s` (dotAll) in generator code — Vercel target is ES2017; use `[\s\S]` instead

## Import helper

**Regenerate bundle (from `archsphere/`):**

```bash
npx tsx scripts/bundle-agent-artifacts.ts
```

**Copy to MCP package (before publish or local MCP refresh):**

```bash
cd archsphere-mcp && npm run copy-bundled-artifacts
```

**Refresh workspace catalog via MCP:**

```json
import_agent_artifacts({
  "refreshFromRepoBundle": true,
  "updateExisting": true
})
```

Requires MCP restarted after bundle/generator changes if using published `@arqueosfera/mcp`. **Prefer** bulk refresh from the monorepo bundle (includes latest `RULE_PURPOSE_PT` / generator output):

```bash
cd archsphere
npx tsx scripts/bundle-agent-artifacts.ts
npx tsx scripts/refresh-all-agent-artifact-docs.ts
```

The script reads `ARCHSPHERE_*` from env, `.env`, or the running `archsphere-mcp` process.

Single slug:

```json
import_agent_artifacts({
  "slug": "archsphere-logbook",
  "kind": "rule",
  "refreshFromRepoBundle": true,
  "updateExisting": true
})
```

**Arqueosfera distribution:** delivery + optional packages only for client projects — see [arqueosfera-distribution-manifest.md](arqueosfera-distribution-manifest.md).

## Related

- Template: [catalog-entry-template.md](catalog-entry-template.md)
- Catalog UI: Settings → Agent artifacts
- MCP: `list_agent_artifacts`, `get_agent_artifact`, `import_agent_artifacts`
- Agents use MCP only — not Integration API directly
