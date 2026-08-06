# Manifesto de distribuição Arqueosfera

Skills e rules **genéricas** distribuídas com o Arqueosfera para workspaces que usam o starter Next.js + Supabase e a cadeia de entrega multi-agente.

**Catálogo no produto:** Settings → Agent artifacts (`agent-artifacts-catalog`) ou MCP `list_agent_artifacts` / `get_agent_artifact` (scope `catalog:read`).

**Import em massa (repo Archsphere):** `POST /api/agent-artifacts/import-from-repo` — gera documentação e cadastra slugs ausentes.

---

## Pacotes

| Pacote | Qtd | Quando usar |
|--------|-----|-------------|
| **delivery** | 19 rules + 13 skills (+ `AGENTS.md` + templates) | Instalação padrão em todo projeto novo |
| **optional** | 5 skills (+ templates/scripts) | Sob demanda (comercial, conteúdo, canal, disco, scaffold) |
| **platform** | 1 skill | Só no repo Archsphere — documenta o próprio catálogo |

**Total instalável:** 53 arquivos no pacote delivery + 12 optional = **65 arquivos** (ver tabela de templates abaixo).

---

## Pacote delivery — skills (13)

| Slug | Categoria | Rules relacionadas |
|------|-----------|-------------------|
| `skill-routing` | Delivery chain | skill-routing |
| `archsphere-integration` | Integration & MCP | mcp-credentials, archsphere-logbook, api-route-handlers, domain-lifecycle-actions |
| `git-commit` | Operations | quality-gates |
| `software-development` | Delivery chain | clean-code, clean-code-examples, english-codebase, typescript-standards, quality-gates, domain-lifecycle-actions, lib-domain-logic, views-and-components, nextjs-app-router, css-design-system, i18n-messages |
| `qa-testing` | Delivery chain | quality-gates, testing-vitest |
| `product-management` | Delivery chain | — |
| `ux-design` | Delivery chain | views-and-components, css-design-system, i18n-messages |
| `design-doc` | Architecture & design | — |
| `business-architecture` | Architecture & design | — |
| `solution-architecture` | Architecture & design | — |
| `security-architecture` | Architecture & design | mcp-credentials, api-route-handlers |
| `delivery-reviewer` | Delivery chain | — |
| `people-development` | Delivery chain | — |

Cada skill inclui `SKILL.md` e arquivos de apoio (`*-template.md`, `examples.md`, `reference.md`, scripts quando aplicável).

---

## Pacote delivery — rules (19)

Todas em `.cursor/rules/*.mdc`:

| Slug | Categoria | Skills que carregam |
|------|-----------|---------------------|
| `clean-code` | Coding standards | software-development |
| `clean-code-examples` | Coding standards | software-development |
| `english-codebase` | Coding standards | software-development |
| `typescript-standards` | Coding standards | software-development |
| `quality-gates` | Quality & testing | software-development, qa-testing, git-commit |
| `testing-vitest` | Quality & testing | qa-testing |
| `skill-routing` | Delivery chain | skill-routing |
| `domain-lifecycle-actions` | Architecture & design | software-development, archsphere-integration |
| `views-and-components` | Architecture & design | software-development, ux-design |
| `nextjs-app-router` | Architecture & design | software-development |
| `lib-domain-logic` | Architecture & design | software-development |
| `css-design-system` | Architecture & design | software-development, ux-design |
| `i18n-messages` | Architecture & design | software-development, ux-design |
| `api-route-handlers` | Integration & MCP | archsphere-integration, security-architecture |
| `mcp-credentials` | Integration & MCP | archsphere-integration, security-architecture |
| `archsphere-logbook` | Integration & MCP | archsphere-integration |
| `supabase-auth` | Infrastructure | create-project |
| `supabase-migrations` | Infrastructure | create-project |
| `monorepo-layout` | Infrastructure | create-project |

Mais **`AGENTS.md`** na raiz do projeto (instruções mínimas do agente).

---

## Pacote optional — skills (5)

| Slug | Categoria | Uso |
|------|-----------|-----|
| `commercial-sales` | Delivery chain | Pesquisa de mercado, pricing, posicionamento |
| `content-writing` | Content & media | Artigos, livros, roteiros |
| `sem-bala-de-prata` | Content & media | Canal YouTube NotebookLM |
| `linux-disk-cleanup` | Operations | Limpeza de disco em dev Linux |
| `create-project` | Infrastructure | Scaffold a partir do template GitHub |

Rules de infra (`monorepo-layout`, `supabase-*`) já vêm no delivery; `create-project` referencia o starter.

---

## Plataforma — não distribuir em projetos cliente

| Slug | Motivo |
|------|--------|
| `agent-artifacts-documentation` | Meta-skill do catálogo Archsphere; permanece no repo do produto |

Cadastrada no catálogo do workspace Archsphere para referência interna.

---

## Fluxo recomendado

### Novo projeto (create-project)

1. Scaffold via `create-project` skill / script.
2. Instalar **pacote delivery** (53 arquivos) — ver fluxo abaixo (setup guiado ou agente manual).
3. Adicionar **optional** conforme necessidade (ex.: `content-writing` + `sem-bala-de-prata` para canal).

### Setup guiado (projeto WBS «Arqueosfera — Setup guiado»)

Etapa 3: **tudo** via catálogo MCP (`rule`, `skill`, `template`, `script`) + WBS **Passo 3 — AGENTS.md** apenas. Manifesto lista slugs por fase.

### Agente Cursor — instalar no repo local

1. `list_agent_artifacts` — filtrar por `kind` e pacote (delivery/optional).
2. `get_agent_artifact({ slug })` — **`sourcePath`** + **Código-fonte**.
3. Gravar cada arquivo no projeto alvo.
4. `AGENTS.md` — artefato WBS do projeto de setup (não está no catálogo).

### Manutenção

Quando alterar um `.mdc` ou `SKILL.md` no repo template:

1. Atualizar o arquivo no repositório.
2. Regenerar entrada no catálogo (import-from-repo ou skill `agent-artifacts-documentation`).
3. Republicar artefato WBS de setup se o projeto de onboarding usar WBS.

---

## Templates e scripts (delivery — fase 3)

Arquivos além de `SKILL.md` / rules incluídos no pacote delivery:

- `archsphere-integration/reference.md`
- `git-commit/scripts/commit-context.sh`
- `software-development/examples.md`
- `qa-testing/examples.md`
- `product-management/feature-spec-template.md`, `task-spec-template.md`, `examples.md`
- `ux-design/ux-spec-template.md`, `examples.md`
- `design-doc/design-doc-template.md`
- `business-architecture/assessment-template.md`, `examples.md`
- `solution-architecture/parecer-template.md`, `examples.md`
- `security-architecture/assessment-template.md`, `examples.md`
- `delivery-reviewer/review-checklist.md`, `examples.md`
- `people-development/development-plan-template.md`, `examples.md`

Optional adiciona templates/scripts de `commercial-sales`, `content-writing`, `sem-bala-de-prata`, `linux-disk-cleanup`, `create-project`.

---

## Referências

- Skill de documentação: [SKILL.md](SKILL.md)
- Template de entrada: [catalog-entry-template.md](catalog-entry-template.md)
- Roteamento: [skill-routing/SKILL.md](../skill-routing/SKILL.md)
- Integração MCP/API: [archsphere-integration/SKILL.md](../archsphere-integration/SKILL.md)
