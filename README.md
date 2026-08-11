# Drag Race MCP (WIP) 👑

> An unofficial, community-driven MCP (Model Context Protocol) server for Drag Race knowledge.

`drag-race-mcp` gives AI assistants structured access to queens, seasons, episodes, and fan lore through MCP tools.

> **Disclaimer**
>
> This is an **unofficial fan project** and is **not affiliated with, endorsed by, or sponsored by** RuPaul, World of Wonder, or the Drag Race franchise.

---

## Features

**Ready**

- Typed knowledge model (seasons, queens, episodes, lore)
- JSON knowledge base + Zod validation + integrity checks
- Core MCP read tools (list / search / get for seasons, queens, episodes, lore)
- Cursor-friendly local MCP config + workflow docs

**Coming next**

- Compare queens, recommendations, richer stats
- Broader franchise coverage; optional RAG later

---

## Example questions

- Who are the Porkchop queens?
- Which queens competed on both Season 5 and All Stars?
- Compare Jinkx Monsoon and Bianca Del Rio.
- Which queens have the most challenge wins?
- Recommend a season with lots of comedy.
- Explain the rivalry between Alyssa Edwards and Coco Montrese.

---

## Data model (for agents & contributors)

IDs and catalogs live in `src/kb/catalogs.ts`; entity shapes are Zod schemas in `src/kb/schemas/` (types via `z.infer`). Designed so models can navigate facts without burning tokens on repeated prose.

### Hard facts

| Type | Where | What it stores |
|------|-------|----------------|
| `Season` | `kb/schemas/season.ts` | Franchise season metadata, cast IDs, winner, prize, hosts/judges |
| `Queen` | `kb/schemas/queen.ts` | Drag name, aliases, per-season appearances & wins |
| `Episode` | `kb/schemas/episode.ts` | Week-by-week challenges, runway, lip sync, eliminations |
| `Money` | `kb/schemas/money.ts` | Amount + currency enum |
| `PersonRef` | `kb/schemas/person.ts` | Host/judge `{ name, queenId? }` |
| `SeasonId` / `Currency` / `LoreTag` | `kb/catalogs.ts` | Closed catalogs + string ID aliases |

These are the **source of truth** for placements, wins, cast lists, and episode outcomes.

### IDs keep tokens small

Everywhere possible we link by **stable IDs**, not full nested objects:

| ID | Example | Notes |
|----|---------|--------|
| `SeasonId` | `US-S17`, `AS-S10`, `CVTW-S02` | Closed enum of known seasons |
| `EpisodeId` | `US-S17-E05` | `{SeasonId}-E{NN}` |
| `QueenId` | `jinkx-monsoon` | Kebab-case slug (open set; validated from data later) |
| `LoreId` | `alyssa-coco-rivalry` | Kebab-case slug |

**Why IDs?**

- Smaller payloads in tool responses (pass `castIds`, expand only when needed)
- Safer LLM contributions (reference `US-S06` instead of rewriting season text)
- Easy joins: season → queen IDs → look up queen; queen win → `episodeId` → look up episode

A season stores `castIds` and `episodeIds`. A queen stores appearance stats that point at `episodeId`s. Tools (and later `list_queen_ids`) help the model discover valid IDs instead of inventing them.

### Lore expands the model’s power

Hard facts answer *what happened*. **Lore** answers *why it matters* and *how things connect*:

```ts
Lore {
  id, title, summary, tags,
  queenIds?, seasonIds?, episodeIds?
}
```

Add lore entries to teach rivalries, iconic moments, comedy seasons, drag families, controversies, and more — tagged (`rivalry`, `drama`, `comedy`, `iconic`, …) and linked back to the fact catalogs via IDs.

**Contribution loop for LLMs / humans:**

1. Prefer existing IDs when linking
2. Add or fix hard-fact records when something is missing or wrong
3. Add lore when you want narrative, correlation, or fan context

That’s how the KB grows without duplicating full queen/season blobs everywhere.

---

## Data coverage

Track what data exists for each `SeasonId`. Flip `—` → `✅` when that slice is in the knowledge base.

| Column | Meaning |
|--------|---------|
| **Season** | Season record (meta, cast IDs, winner, prize, hosts/judges) |
| **Queens** | Queen records for the cast (appearances, wins) |
| **Episodes** | Episode records for the season |
| **Lore** | At least one lore entry linked to this season |

Everything starts empty — **this is the contribution map**. Pick any `—` and fill it.

### US — RuPaul's Drag Race

| SeasonId | Season | Queens | Episodes | Lore |
|----------|:------:|:------:|:--------:|:----:|
| `US-S01` | ✅ | ✅ | ✅ | ✅ |
| `US-S02` | ✅ | ✅ | ✅ | ✅ |
| `US-S03` | ✅ | ✅ | ✅ | ✅ |
| `US-S04` | ✅ | ✅ | ✅ | ✅ |
| `US-S05` | ✅ | ✅ | ✅ | ✅ |
| `US-S06` | ✅ | ✅ | ✅ | ✅ |
| `US-S07` | ✅ | ✅ | ✅ | ✅ |
| `US-S08` | ✅ | ✅ | ✅ | ✅ |
| `US-S09` | ✅ | ✅ | ✅ | ✅ |
| `US-S10` | ✅ | ✅ | ✅ | ✅ |
| `US-S11` | ✅ | ✅ | ✅ | ✅ |
| `US-S12` | ✅ | ✅ | ✅ | ✅ |
| `US-S13` | ✅ | ✅ | ✅ | ✅ |
| `US-S14` | ✅ | ✅ | ✅ | ✅ |
| `US-S15` | ✅ | ✅ | ✅ | ✅ |
| `US-S16` | ✅ | ✅ | ✅ | ✅ |
| `US-S17` | ✅ | ✅ | ✅ | ✅ |
| `US-S18` | ✅ | ✅ | ✅ | ✅ |

### AS — All Stars

| SeasonId | Season | Queens | Episodes | Lore |
|----------|:------:|:------:|:--------:|:----:|
| `AS-S01` | ✅ | ✅ | ✅ | ✅ |
| `AS-S02` | ✅ | ✅ | ✅ | ✅ |
| `AS-S03` | ✅ | ✅ | ✅ | ✅ |
| `AS-S04` | ✅ | ✅ | ✅ | ✅ |
| `AS-S05` | ✅ | ✅ | ✅ | ✅ |
| `AS-S06` | ✅ | ✅ | ✅ | ✅ |
| `AS-S07` | ✅ | ✅ | ✅ | ✅ |
| `AS-S08` | ✅ | ✅ | ✅ | ✅ |
| `AS-S09` | ✅ | ✅ | ✅ | ✅ |
| `AS-S10` | ✅ | ✅ | ✅ | ✅ |
| `AS-S11` | ✅ | ✅ | ✅ | ✅ |

### UK

| SeasonId | Season | Queens | Episodes | Lore |
|----------|:------:|:------:|:--------:|:----:|
| `UK-S01` | ✅ | ✅ | ✅ | ✅ |
| `UK-S02` | ✅ | ✅ | ✅ | ✅ |
| `UK-S03` | ✅ | ✅ | ✅ | ✅ |
| `UK-S04` | ✅ | ✅ | ✅ | ✅ |
| `UK-S05` | ✅ | ✅ | ✅ | ✅ |
| `UK-S06` | ✅ | ✅ | ✅ | ✅ |
| `UK-S07` | ✅ | ✅ | ✅ | ✅ |

### Canada

| SeasonId | Season | Queens | Episodes | Lore |
|----------|:------:|:------:|:--------:|:----:|
| `CA-S01` | ✅ | ✅ | ✅ | ✅ |
| `CA-S02` | ✅ | ✅ | ✅ | ✅ |
| `CA-S03` | ✅ | ✅ | ✅ | ✅ |
| `CA-S04` | ✅ | ✅ | ✅ | ✅ |
| `CA-S05` | ✅ | ✅ | ✅ | ✅ |
| `CA-S06` | ✅ | ✅ | ✅ | ✅ |
| `CVTW-S01` | — | — | — | — |
| `CVTW-S02` | — | — | — | — |
| `CAS-S01` | — | — | — | — |

### Europe

| SeasonId | Season | Queens | Episodes | Lore |
|----------|:------:|:------:|:--------:|:----:|
| `ES-S01` | ✅ | ✅ | ✅ | ✅ |
| `ES-S02` | ✅ | ✅ | ✅ | ✅ |
| `ES-S03` | ✅ | ✅ | ✅ | ✅ |
| `ES-S04` | ✅ | ✅ | ✅ | ✅ |
| `ES-S05` | ✅ | ✅ | ✅ | ✅ |
| `ESAS-S01` | — | — | — | — |
| `ESAS-S02` | — | — | — | — |
| `FR-S01` | ✅ | ✅ | ✅ | ✅ |
| `FR-S02` | ✅ | ✅ | ✅ | ✅ |
| `FR-S03` | ✅ | ✅ | ✅ | ✅ |
| `FR-S04` | — | — | — | — |
| `IT-S01` | ✅ | ✅ | ✅ | ✅ |
| `IT-S02` | ✅ | ✅ | ✅ | ✅ |
| `IT-S03` | ✅ | ✅ | ✅ | ✅ |
| `DE-S01` | ✅ | ✅ | ✅ | ✅ |
| `NL-S01` | ✅ | ✅ | ✅ | ✅ |
| `NL-S02` | ✅ | ✅ | ✅ | ✅ |
| `BE-S01` | ✅ | ✅ | ✅ | ✅ |
| `BE-S02` | ✅ | ✅ | ✅ | ✅ |
| `SE-S01` | ✅ | ✅ | ✅ | ✅ |

### Latin America

| SeasonId | Season | Queens | Episodes | Lore |
|----------|:------:|:------:|:--------:|:----:|
| `MX-S01` | ✅ | ✅ | ✅ | ✅ |
| `MX-S02` | ✅ | ✅ | ✅ | ✅ |
| `MX-S03` | — | — | — | — |
| `MXLR-S01` | — | — | — | — |
| `BR-S01` | ✅ | ✅ | ✅ | ✅ |
| `BR-S02` | ✅ | ✅ | ✅ | ✅ |

### Asia–Pacific & global

| SeasonId | Season | Queens | Episodes | Lore |
|----------|:------:|:------:|:--------:|:----:|
| `TH-S01` | ✅ | ✅ | ✅ | ✅ |
| `TH-S02` | ✅ | ✅ | ✅ | ✅ |
| `TH-S03` | ✅ | ✅ | ✅ | ✅ |
| `PH-S01` | ✅ | ✅ | ✅ | ✅ |
| `PH-S02` | ✅ | ✅ | ✅ | ✅ |
| `PH-S03` | ✅ | ✅ | ✅ | ✅ |
| `PH-S04` | — | — | — | — |
| `PHSR-S01` | — | — | — | — |
| `GAS-S01` | ✅ | ✅ | ✅ | ✅ |
| `DU-S01` | ✅ | ✅ | ✅ | ✅ |
| `DU-S02` | ✅ | ✅ | ✅ | ✅ |
| `DU-S03` | ✅ | ✅ | ✅ | ✅ |
| `DU-S04` | ✅ | ✅ | ✅ | ✅ |
| `DUVTW-S01` | — | — | — | — |

---

## Project structure

```text
├── src/
│   ├── index.ts              # MCP entry (stdio)
│   ├── server.ts             # Server + tool registration
│   ├── data/                 # JSON only (no TypeScript)
│   │   ├── queens/           # One JSON file per QueenId
│   │   └── seasons/
│   │       └── US-S01/ … US-S07/, AS-S01/, AS-S02/
│   │           ├── season.json
│   │           ├── episodes.json
│   │           └── lore.json
│   ├── kb/                   # Data layer: catalogs, Zod, load, integrity
│   │   ├── catalogs.ts
│   │   ├── schemas/
│   │   ├── load.ts
│   │   ├── integrity.ts
│   │   └── index.ts
│   ├── services/             # Utilities tools call (not MCP)
│   │   ├── accessors/        # accessors.ts → get* / list*Ids
│   │   ├── seasons/          # list_season_ids.ts
│   │   ├── queens/           # search_queens.ts, list_queen_ids_for_season.ts
│   │   ├── lore/             # search_lore.ts
│   │   └── shared/           # limits.ts
│   └── tools/                # MCP registerTool wrappers only
│       ├── general/          # welcome_user.ts
│       ├── seasons/          # list_season_ids.ts, get_season.ts
│       ├── queens/           # list_queen_ids.ts, search_queens.ts, get_queen.ts
│       ├── episodes/         # get_episode.ts
│       └── lore/             # get_lore.ts, search_lore.ts
│
├── .cursor/
│   ├── mcp.json              # Local Cursor MCP config ADD WHEN YOU NEED IT.
│   └── skills/
│       ├── drag-race-data/   # How to contribute season/queen JSON
│       └── typescript-style/ # Arrow-const functions + TS conventions
│
├── package.json
├── tsconfig.json
└── README.md
```

JSON facts live under `src/data/` (queens global; seasons as `src/data/seasons/<SeasonId>/`). The `src/kb/` layer validates and indexes them via Zod + Maps. See `.cursor/skills/drag-race-data/` when contributing with an agent.

### Validating data

After adding or editing anything under `src/data/`, run:

```bash
pnpm test
```

That loads every JSON file through Zod, rejects bad fields and duplicate IDs, and fails with file + field paths. `git commit` runs the same check via a Husky pre-commit hook — still run the test yourself while editing so you catch issues before commit. After a fresh clone, run `pnpm install` once so Husky installs the hook.

---

## Test locally with Cursor

This is how an Agent chat (like this one) can see and call tools from `drag-race-mcp`.

### 1. Install & run prerequisites

```bash
pnpm install
```

You do **not** need to keep a terminal process running yourself. Cursor starts the MCP server using `.cursor/mcp.json`.

### 2. Project MCP config

This repo already includes `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "drag-race-mcp": {
      "command": "pnpm",
      "args": [
        "--dir",
        "/ABS/PATH/TO/drag-race-mcp",
        "exec",
        "tsx",
        "src/index.ts"
      ]
    }
  }
}
```

Update the `--dir` path to **your** machine’s clone path if it differs.

Cursor loads project MCP config from `.cursor/mcp.json` when the workspace is open. You can also add the same server under **Cursor Settings → MCP** (user-level) if you prefer.

### 3. Enable / refresh the server

1. Open **Cursor Settings → MCP**
2. Find `drag-race-mcp`
3. Confirm it connects (no error state). Use refresh/restart if you changed code or config
4. Open a **new Agent chat** in this workspace so it picks up the tool list

### 4. Smoke-test a tool

Ask the agent something like:

> Call the `welcome_user` tool with my name.

If MCP is wired correctly, the agent will invoke `welcome_user` and return a welcome string from this server.

That’s the same path used in development: **Cursor discovers the server’s tools over MCP, then the model can call them** (list tools → choose one → run with args → read the result).

### 5. After you add tools

1. Register the tool on the server (see `src/tools/general/welcome_user.ts`)
2. Restart/refresh the MCP server in Cursor
3. Start a new Agent chat
4. Ask the agent to use the new tool by name or describe the task and let it pick the tool

**Tips**

- Tool `description` and Zod `.describe(...)` text are what the model reads — keep them clear
- If tools don’t show up: check MCP error logs, path in `mcp.json`, and that `pnpm exec tsx src/index.ts` runs cleanly in a terminal
- Prefer a new chat after MCP restarts so the tool catalog is fresh

---

## MCP tools

| Tool | Description |
|------|-------------|
| `welcome_user` | Smoke-test / hello |
| `list_season_ids` | List loaded seasons; optional `region` (`us`, `uk`, `canada`, `europe`, `latam_br`, `asia_pacific`, `specials`) |
| `get_season` | Season record + linked IDs |
| `list_queen_ids` | Cast queen ids for one `seasonId` (required) |
| `search_queens` | Search queens by name/alias (limit default 20, max 50) |
| `get_queen` | Full queen record |
| `get_episode` | Episode detail |
| `get_lore` | Lore entry by id |
| `search_lore` | Search lore by query, tags, queen, and/or season |

**Planned (v2+):** `compare_queens`, `recommend_season`, stats aggregations.

---

## Roadmap

### v1

- [x] Stable TypeScript interfaces (IDs + hard facts + lore)
- [x] JSON data + Zod schemas
- [x] Core read tools (queen / season / episode / lore)
- [x] Local Cursor workflow documented

### v2

- Richer search & stats
- Recommendations
- Broader franchise coverage in data

### v3

- Semantic search (RAG)
- Community ratings / richer metadata

---

## Contributing

Contributions welcome — especially filling gaps in **[Data coverage](#data-coverage)**:

- Fix incorrect hard facts
- Add missing queens / seasons / episodes (use ID conventions)
- Add lore that links existing IDs
- Mark the matching cell `✅` in this README when a slice is done
- New MCP tools & docs

### Pull requests & commits

Do **not** push straight to `main` (branch protection). Work on a branch and open a PR.

**Branch names**

- `feat/...` — new capability (types, tools, data for a season)
- `fix/...` — bug fix
- `docs/...` — README / comments only
- `chore/...` — tooling, deps, cleanup

**Commit / PR titles** (Conventional Commits style)

| Prefix | Use for |
|--------|---------|
| `feat:` | New feature or data/types that unlock new agent behavior |
| `fix:` | Bug fix |
| `docs:` | Documentation only |
| `chore:` | Maintenance (deps, config, formatting) |
| `refactor:` | Code change with no behavior change |

Examples:

- `feat: add Season and SeasonId types`
- `feat: add US-S06 season + cast data`
- `fix: correct porkchopId for US-S01`
- `docs: update data coverage checklist`

**PR body** — short summary of *why*, plus a tiny test plan (e.g. `tsc`, which coverage cells flipped, MCP tool smoke test).

Open an issue or PR.

---

## License

MIT

---

## Acknowledgements

Built by the community, for the community. Drag Race fans, MCP builders, and AI enthusiasts — you’re welcome here.

> **Disclaimer:** Drag Race MCP is an unofficial fan project. It is not affiliated with, endorsed by, or sponsored by RuPaul, World of Wonder, or the Drag Race franchise.
