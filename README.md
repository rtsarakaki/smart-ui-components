# smart-ui-components

Reusable React UI controls extracted for Archsphere and other apps.

## First component: `DataGrid`

- Client-side **column sorting**
- Built-in **pagination** (page + page size)
- Native **edit** and **delete** action buttons
- Receives a dataset (`rows`) and declarative `columns`

```tsx
import { DataGrid } from "smart-ui-components";

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
  onEdit={(row) => open(row)}
  onDelete={(row) => confirmDelete(row)}
  onRowActivate={(row) => open(row)}
  actionLabels={{ /* … */ }}
  paginationLabels={{ /* … */ }}
/>
```

## Scripts

- `npm run build` — emit `dist/`
- `npm test` — Vitest
- `npm run quality` — type-check + lint + tests

## Publish

Push to `main` runs GitHub Actions: quality checks, then npm publish with provenance (trusted publishing) + GitHub release + semantic-release, same pattern as `smart-value-objects`.

Configure the npm package for [trusted publishing](https://docs.npmjs.com/trusted-publishers) linked to this repository before the first release workflow.
