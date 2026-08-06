# Software development — examples

Before/after patterns aligned with `clean-code.mdc` and this monorepo.

## Guard clauses — no else, no nesting

```ts
// ❌ nested if + else
function resolveTaskBadge(task: ProjectTask): BadgeVariant {
  if (task.status === "done") {
    return "success";
  } else {
    if (task.dueDate && isPast(task.dueDate)) {
      return "danger";
    } else {
      return "default";
    }
  }
}

// ✅ flat guards
function resolveTaskBadge(task: ProjectTask): BadgeVariant {
  if (task.status === "done") return "success";
  if (task.dueDate && isPast(task.dueDate)) return "danger";
  return "default";
}
```

```ts
// ❌ else in API route
export async function GET() {
  if (!isSupabaseAuthConfigured()) {
    return NextResponse.json({ message: "Not configured" }, { status: 503 });
  } else {
    const user = await getUser();
    return NextResponse.json({ user });
  }
}

// ✅ early returns (see api-route-handlers.mdc)
export async function GET() {
  if (!isSupabaseAuthConfigured()) {
    return NextResponse.json({ message: "Not configured" }, { status: 503 });
  }
  const user = await getUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ user });
}
```

## Immutability

```ts
// ❌ mutate input
function appendArtifact(artifacts: WbsArtifact[], next: WbsArtifact) {
  artifacts.push(next);
  return artifacts;
}

// ✅ new array
function appendArtifact(
  artifacts: ReadonlyArray<WbsArtifact>,
  next: WbsArtifact,
): ReadonlyArray<WbsArtifact> {
  return [...artifacts, next];
}
```

```tsx
// ❌ mutate state
const onToggle = (id: string) => {
  selectedIds.push(id);
  setSelectedIds(selectedIds);
};

// ✅ new reference
const onToggle = (id: string) => {
  setSelectedIds((current) =>
    current.includes(id)
      ? current.filter((itemId) => itemId !== id)
      : [...current, id],
  );
};
```

## Small pure functions (SRP + testability)

```ts
// ❌ one function does everything
function buildBurndownResponse(raw: unknown, workspaceId: string) {
  // 60 lines: parse JSON, filter, sort, compute series, format dates...
}

// ✅ pipeline of pure steps in lib/projects/
type BurndownPoint = { date: string; remaining: number };

function parseBurndownTasks(raw: unknown): ReadonlyArray<RawTask> { /* ... */ }
function filterTasksByWorkspace(
  tasks: ReadonlyArray<RawTask>,
  workspaceId: string,
): ReadonlyArray<RawTask> { /* ... */ }
function computeBurndownSeries(tasks: ReadonlyArray<RawTask>): ReadonlyArray<BurndownPoint> { /* ... */ }

export function buildBurndownResponse(
  raw: unknown,
  workspaceId: string,
): ReadonlyArray<BurndownPoint> {
  const tasks = parseBurndownTasks(raw);
  const scoped = filterTasksByWorkspace(tasks, workspaceId);
  return computeBurndownSeries(scoped);
}
```

Each step gets a focused `*.test.ts` with table-driven cases.

## Open/Closed — map instead of growing if/else

```ts
type TaskStatus = "todo" | "in_progress" | "done";

// ❌ new status = edit central ladder
function statusLabel(status: TaskStatus): string {
  if (status === "todo") return "To do";
  if (status === "in_progress") return "In progress";
  if (status === "done") return "Done";
  return "Unknown";
}

// ✅ extend by adding map entries
const STATUS_LABELS: Readonly<Record<TaskStatus, string>> = {
  todo: "To do",
  in_progress: "In progress",
  done: "Done",
};

function statusLabel(status: TaskStatus): string {
  return STATUS_LABELS[status];
}
```

## Dependency inversion — pure core, I/O at edge

```ts
// lib/projects/projectTaskBurndown.ts — pure, no Supabase
export function computeRemainingPoints(
  tasks: ReadonlyArray<{ points: number; status: TaskStatus }>,
): number {
  return tasks
    .filter((task) => task.status !== "done")
    .reduce((sum, task) => sum + task.points, 0);
}

// lib/projects/projectTasksServer.ts — server-only boundary
import "server-only";

export async function fetchProjectTasks(projectId: string) {
  const supabase = await createClient();
  // query, map rows to domain types, return
}
```

Route handler: auth guards → `fetchProjectTasks` → `computeRemainingPoints` → JSON.

## Discriminated unions over optional soup (ISP + types)

```ts
// ❌ optional fields — callers must guess valid combinations
type SaveResult = {
  success?: boolean;
  error?: string;
  taskId?: string;
};

// ✅ explicit states
type SaveResult =
  | { kind: "success"; taskId: string }
  | { kind: "validation_error"; message: string }
  | { kind: "unauthorized" };

function handleSaveResult(result: SaveResult): void {
  if (result.kind === "validation_error") {
    setError(result.message);
    return;
  }
  if (result.kind === "unauthorized") {
    redirect("/login");
    return;
  }
  router.push(`/tasks/${result.taskId}`);
}
```

## Functional composition

```ts
const normalizeEmail = (value: string): string => value.trim().toLowerCase();

const isValidEmail = (value: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

type EmailInput = { raw: string };

type ValidEmail = { value: string };

function parseEmail(input: EmailInput): ValidEmail | null {
  const normalized = normalizeEmail(input.raw);
  if (!isValidEmail(normalized)) return null;
  return { value: normalized };
}
```

## React — thin component, logic in lib/hook

```tsx
// ❌ business rules embedded in JSX
export function TaskPoints({ tasks }: { tasks: ProjectTask[] }) {
  let total = 0;
  for (const t of tasks) {
    if (t.status !== "done") total += t.points ?? 0;
  }
  return <span>{total}</span>;
}

// ✅ computed outside render noise
import { computeRemainingPoints } from "@/lib/projects/projectTaskBurndown";

export function TaskPoints({ tasks }: { tasks: ReadonlyArray<ProjectTask> }) {
  const remaining = computeRemainingPoints(tasks);
  return <span>{remaining}</span>;
}
```

## Minimal bug fix diff

When fixing a bug:

1. Reproduce with a test on the pure function if possible.
2. Fix the smallest layer that owns the bug.
3. Do not refactor unrelated files in the same commit unless the user asked.

```ts
// test first
it(" treats missing points as zero", () => {
  expect(
    computeRemainingPoints([{ points: undefined as unknown as number, status: "todo" }]),
  ).toBe(0);
});
```
