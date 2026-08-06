# @arqueosfera/smart-ui-components

Reusable React UI controls extracted for Archsphere and other apps.

## Components

### `DataGrid`

- Client-side **column sorting**
- Built-in **pagination** (page + page size)
- Native **edit** and **delete** action buttons
- **Extra / custom row actions** (`extraActions` or `renderRowActions`) for screens like participants
- Optional **selected row** highlight via `selectedRowId` / `getRowClassName`
- Receives a dataset (`rows`) and declarative `columns`

```tsx
import { DataGrid } from "@arqueosfera/smart-ui-components";

<DataGrid
  rows={items}
  columns={[
    {
      id: "title",
      header: "Title",
      sortable: true,
      getSortValue: (row) => row.title,
      render: (row) => row.title,
    },
  ]}
  getRowId={(row) => row.id}
  ariaLabel="Items"
  selectedRowId={selectedId}
  onEdit={(row) => open(row)}
  onDelete={(row) => confirmDelete(row)}
  onRowActivate={(row) => open(row)}
  extraActions={[
    {
      id: "prompt",
      label: (row) => `Generate prompt for ${row.title}`,
      shortLabel: "1:1",
      onClick: (row) => generatePrompt(row),
      visible: (row) => row.canEdit,
    },
  ]}
  actionLabels={{ /* … */ }}
  paginationLabels={{ /* … */ }}
/>
```

### `DatasetPicker`

Generic “choose one item from a dataset” field (participant picker pattern):

- Trigger shows the selected item; button opens a modal
- **Description** search field is always present
- **Type** filter is optional (`typeOptions`)
- Items are passed as a plain `items` dataset (`id`, `label`, `description?`, `type?`, `imageUrl?`)

```tsx
import { DatasetPicker } from "@arqueosfera/smart-ui-components";

<DatasetPicker
  fieldLabel="Responsible"
  value={selectedId}
  onChange={setSelectedId}
  items={dataset}
  typeOptions={[
    { value: "partner", label: "Partner" },
    { value: "stakeholder", label: "Stakeholder" },
  ]}
  labels={{ /* i18n strings */ }}
/>
```

## Scripts

- `npm run build` — emit `dist/`
- `npm run lint` — ESLint (max-warnings 0)
- `npm run test:coverage` — Vitest with 80% coverage gate
- `npm run quality` — type-check + lint + test:coverage
- **Pre-commit (Husky):** runs `lint` + `test:coverage` (same as Archsphere)

## Agents

See [AGENTS.md](./AGENTS.md) and `.cursor/rules/index.mdc` for curated Cursor rules/skills (subset of Archsphere, adapted for this npm UI library).

## Publish

Push to `main` runs GitHub Actions: quality checks, then npm publish with provenance (trusted publishing) + GitHub release + semantic-release, same pattern as `smart-value-objects`.

### First-time npm setup (required before CI can publish)

1. Create the empty package on [npmjs.com](https://www.npmjs.com/) (or let the first publish create it if your account allows).
2. Package settings → **Trusted Publishers** → add GitHub Actions:
   - Repository: `rtsarakaki/smart-ui-components`
   - Workflow: `ci.yml`
   - Environment: leave empty unless you use one
3. Push to `main` (or re-run the Release job).

Until the package is on npm, Archsphere may depend via `file:../../smart-ui-components`. After `1.0.0` is published, switch to `"@arqueosfera/smart-ui-components": "^1.0.0"`.
