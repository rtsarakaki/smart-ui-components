# Especificação de tarefa — template Archsphere

Use em **toda** tarefa de projeto (`create_task` / `update_task`).

| Camada | Sempre | Quando |
|--------|--------|--------|
| **Em uma frase** | ✓ | Toda tarefa — resumo que qualquer leitor entende |
| **Caso de uso** | ✓ | Toda tarefa — linguagem clara, sem jargão não explicado |
| **Critérios de aceite** | ✓ | Toda tarefa — verificáveis por quem não é especialista |
| **Especificação técnica (completa)** | | Tarefas que **constroem ou alteram código** |
| **Entregáveis leves** | | Alinhamento, governança, workshop — sem código |

---

## Linguagem clara *(obrigatório)*

Escreva para quem **executa a tarefa** e para quem **valida se terminou** — nem sempre são arquitetos ou desenvolvedores.

| Regra | Faça | Evite |
|-------|------|-------|
| **Resumo primeiro** | Abra com **Em uma frase:** o objetivo em linguagem do dia a dia | Começar com siglas ou contexto técnico |
| **Siglas e termos** | Explique na primeira menção ou use **Glossário** curto | MM, ON6, GMT sem contexto |
| **Quem faz o quê** | Nome + papel + ação concreta | Voz passiva (“deve ser alinhado”) |
| **Passos numerados** | Verbos no imperativo: “Marcar reunião”, “Registrar no logbook” | Bullet técnico vago |
| **Critérios de aceite** | “Está pronto quando…” — qualquer revisor consegue marcar sim/não | Critério que exige interpretação |
| **Frases curtas** | Uma ideia por frase | Periodos longos com várias condições |
| **O que NÃO é escopo** | Diga quando ajuda a evitar confusão | Assumir que “todo mundo sabe” |

**Teste rápido:** alguém de outra área consegue explicar a tarefa em 30 segundos depois de ler?

---

## Em uma frase

[Uma frase — o que precisa acontecer e por quê, sem siglas ou com sigla já explicada]

---

## Glossário *(quando houver siglas ou termos de domínio)*

| Termo | Significado em linguagem simples |
|-------|----------------------------------|
| | |

---

## Caso de uso

**Como** [ator — nome e função], **quero** [ação concreta], **para** [benefício claro para o negócio ou para o projeto].

| Campo | Conteúdo |
|-------|----------|
| **Quem executa** | |
| **Antes de começar** | O que já precisa estar feito |
| **Passo a passo** | 1. … 2. … 3. … |
| **Quando termina** | O que fica verdadeiro / o que existe de concreto |
| **Fora desta tarefa** | *(opcional)* O que **não** fazer aqui |

---

## Está pronto quando… *(critérios de aceite)*

- [ ] …
- [ ] …

*(Preferir “Está pronto quando…” em vez de “Dado/Quando/Então” se o time não usar BDD — ou manter Gherkin, mas com frases simples.)*

---

## Especificação técnica *(somente construção de código)*

> Só para tarefas com **código mergeado**. Mesmo aqui: explique o *porquê* antes do *onde no código*.

### O que muda no produto

[Comportamento visível ou contrato — em linguagem simples]

### Onde no código

[Módulos, arquivos, endpoints — para o dev]

### Contratos *(se aplicável)*

| ID | O que muda |
|----|------------|
| API-1 | |

### Como validar

- [ ] Testes: …
- [ ] Lint / build

---

## O que entregar *(tarefas sem código)*

| Entregável | O que é | Onde guardar |
|------------|---------|--------------|
| | ex.: ata da reunião | logbook do projeto |

**Quem precisa participar:** …

**Documentos relacionados:** …

---

## Notas

[Dúvidas em aberto, bloqueios, decisões pendentes]
