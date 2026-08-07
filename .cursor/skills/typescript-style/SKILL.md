---
name: typescript-style
description: >-
  TypeScript coding conventions for drag-race-mcp. Use when writing or editing
  .ts files, adding modules, helpers, MCP tools, or when the user asks how
  TypeScript should be written in this repo.
---

# TypeScript style — drag-race-mcp

## Functions: always arrow consts

Prefer:

```ts
export const functionName = (arg: Type): ReturnType => {
  // ...
};
```

One-liners may omit braces:

```ts
export const getQueen = (id: QueenId): Queen | undefined =>
  getKb().queens.get(id);
```

**Do not** use:

```ts
export function functionName() {}
function helper() {}
```

Local helpers use the same form:

```ts
const readJsonFile = (filePath: string): unknown => {
  // ...
};
```

Async:

```ts
export const main = async (): Promise<void> => {
  // ...
};
```

Generics:

```ts
const parseOrThrow = <T>(
  schema: { parse: (data: unknown) => T },
  data: unknown,
  filePath: string,
): T => {
  // ...
};
```

## Modules

- ESM with `.ts` import extensions: `import { getKb } from "./load.ts"`
- Named exports preferred over `export default`
- `import type` for type-only imports

## Types vs Zod

- Entity shapes (Queen, Season, Episode, Lore, …): Zod in `src/kb/schemas/`, types via `z.infer`
- Closed catalogs (`SeasonId`, `Currency`, `LoreTag`, …): `as const` objects in `src/kb/catalogs.ts`

## Keep it small

- Match existing file style (quotes, semicolons) in the file you edit
- No unnecessary `useMemo`/`useCallback` (N/A here — Node MCP server)
- Fail fast with clear errors (include file paths when loading data)
