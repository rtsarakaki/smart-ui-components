---
name: git-commit
description: >-
  Create git commits with proper messages while running pre-commit hooks (lint
  and tests). Use when the user asks to commit, criar commit, salvar alterações,
  git commit, push, fazer push, or enviar pro remoto — never skip hooks unless
  explicitly requested. On push to production, **complete** the pending DORA
  deploy task opened when work started (see archsphere-integration skill).
---

# Git commit

Minimize tokens: **one context script**, then stage → commit → verify.

Scripts: `.cursor/skills/git-commit/scripts/` (repo root).

## Workflow

1. **Context** (read-only, one command):
   ```bash
   bash .cursor/skills/git-commit/scripts/commit-context.sh
   ```
2. Draft a **1–2 sentence** commit message (why, not bullet dump). Match recent `git log` style.
3. **Stage** only relevant files — never `.env`, credentials, or secrets.
4. **Commit** — hooks MUST run (lint + tests via Husky pre-commit):
   ```bash
   git commit -F - <<'EOF'
   Subject line in imperative mood.

   Optional body explaining why.
   EOF
   ```
   Use `-F -` with heredoc (avoids shell wrapper issues with `-m`).
5. **Verify**: `git status` and confirm hook passed (no `--no-verify`).

## Push workflow (DORA deploy task)

When the user asks to **push** (`push`, `fazer push`, `enviar pro remoto`, `publicar`):

1. If there are uncommitted changes the user expects to ship, run the **commit workflow** first (unless they explicitly push existing commits only).
2. Push only when the user asked — **never** push unprompted:
   ```bash
   git push
   ```
   Use `-u origin HEAD` when the branch has no upstream yet.
3. On **successful push**, **complete the pending deploy task** — follow **DORA deploy lifecycle** in [archsphere-integration](../archsphere-integration/SKILL.md):
   - Use the `deployTaskId` tracked since the change was requested
   - If missing, resolve the matching pending `kind: deploy` task on the target project before creating a new one
   - `update_task`: `status: completed`, `completionDate`, description with commit hash, branch, and remote; align name with `Deploy: {commit subject}` when helpful
4. Confirm to the user: commit hash (if any), push result, and *Deploy DORA concluído* (with task id).

**Do not** `create_task` completed on push when a pending deploy task already exists for this delivery.

**Skip deploy registration** only when the user explicitly says the push is not a production delivery (e.g. WIP branch, docs-only draft remote).

## Pre-commit is mandatory

- **Never** pass `--no-verify`, `--no-gpg-sign`, or skip hooks unless the user **explicitly** asks.
- This repo: Husky `.husky/pre-commit` runs `npm run lint` and `npm run test:coverage` from **repo root**.
- If the hook **fails**: fix lint/tests, stage fixes, create a **new** commit — **do not** `--amend` the failed commit.
- If the hook **passes** but auto-modifies files: only `--amend` when all amend rules below are met.

## Safety rules

- **Never** `git config`, force push to `main`/`master`, or destructive commands.
- **Never** commit unless the user asked to commit.
- **Never** push unless the user asked to push.
- Avoid `git commit --amend` unless ALL are true:
  1. User requested amend, OR hook succeeded but auto-modified files need including
  2. HEAD commit was created in this conversation by you
  3. Commit was **not** pushed to remote

## Message quality

- Imperative subject (~50 chars): `Add …`, `Fix …`, `Update …`
- Body: complete sentences, focus on **why**
- Accurate verbs: `add` = new feature, `fix` = bug, `update` = enhancement, `refactor` = no behavior change

## Output format

```markdown
## Commit

**Hash:** abc1234
**Message:** Update dependencies to resolve npm audit vulnerabilities.

Pre-commit: lint + test:coverage passed.
Working tree: clean
```

## Triggers

commit, criar commit, git commit, salvar no git, commitar, push, fazer push, enviar pro remoto, publicar
