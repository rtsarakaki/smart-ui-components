#!/usr/bin/env bash
# Compact git context for commit message drafting. Read-only.
set -euo pipefail

repo_root=$(git rev-parse --show-toplevel 2>/dev/null) || {
  printf 'ERROR: not a git repository\n'
  exit 1
}
cd "$repo_root"

section() { printf '\n## %s\n' "$1"; }

section "repository"
printf 'root: %s\n' "$repo_root"

section "branch"
git status -sb | head -1
git rev-parse --abbrev-ref '@{upstream}' 2>/dev/null | sed 's/^/upstream: /' || echo 'upstream: (none)'

section "status (short)"
git status -sb

section "staged diff stat"
if git diff --cached --quiet 2>/dev/null; then
  echo "(nothing staged)"
else
  git diff --cached --stat
fi

section "unstaged diff stat"
if git diff --quiet 2>/dev/null; then
  echo "(nothing unstaged)"
else
  git diff --stat
fi

section "untracked files"
untracked=$(git ls-files --others --exclude-standard)
if [[ -z "$untracked" ]]; then
  echo "(none)"
else
  echo "$untracked"
fi

section "recent commits (style reference)"
git log -8 --oneline

section "pre-commit hook"
if [[ -f .husky/pre-commit ]]; then
  echo "husky: .husky/pre-commit"
  cat .husky/pre-commit
elif [[ -x .git/hooks/pre-commit ]]; then
  echo "git: .git/hooks/pre-commit"
  head -20 .git/hooks/pre-commit
else
  echo "(none — commit will not run lint/tests automatically)"
fi

section "monorepo hint"
if [[ -f package.json ]] && grep -q '"prepare".*husky' package.json 2>/dev/null; then
  echo "Husky root package detected — pre-commit likely runs from repo root."
fi
