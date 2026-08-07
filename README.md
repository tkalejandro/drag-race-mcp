# Drag Race MCP (WIP) 👑

> An unofficial, community-driven MCP (Model Context Protocol) server for Drag Race knowledge.

`drag-race-mcp` gives AI assistants structured access to queens, seasons, episodes, and fan lore through MCP tools.

> **Disclaimer**
>
> This is an **unofficial fan project** and is **not affiliated with, endorsed by, or sponsored by** RuPaul, World of Wonder, or the Drag Race franchise.

---

## Features

**Ready / in progress**

- Typed knowledge model (seasons, queens, episodes, lore)
- MCP server skeleton + example tool (`welcome_user`)
- Cursor-friendly local MCP config

**Coming next**

- JSON knowledge base + Zod validation
- Tools: search queens, get season/episode, compare queens, search lore
- Stats, recommendations, optional RAG later

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

The types in `src/types` are designed so models can navigate facts without burning tokens on repeated prose.

### Hard facts

| Type | File | What it stores |
|------|------|----------------|
| `Season` | `season.ts` | Franchise season metadata, cast IDs, winner, prize, hosts/judges |
| `Queen` | `queen.ts` | Drag name, aliases, per-season appearances & wins |
| `Episode` | `episode.ts` | Week-by-week challenges, runway, lip sync, eliminations |
| `Money` | `money.ts` | Amount + currency enum |
| `PersonRef` | `person.ts` | Host/judge `{ name, queenId? }` |

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
| `US-S02` | — | — | — | — |
| `US-S03` | — | — | — | — |
| `US-S04` | — | — | — | — |
| `US-S05` | — | — | — | — |
| `US-S06` | — | — | — | — |
| `US-S07` | — | — | — | — |
| `US-S08` | — | — | — | — |
| `US-S09` | — | — | — | — |
| `US-S10` | — | — | — | — |
| `US-S11` | — | — | — | — |
| `US-S12` | — | — | — | — |
| `US-S13` | — | — | — | — |
| `US-S14` | — | — | — | — |
| `US-S15` | — | — | — | — |
| `US-S16` | — | — | — | — |
| `US-S17` | — | — | — | — |
| `US-S18` | — | — | — | — |

### AS — All Stars

| SeasonId | Season | Queens | Episodes | Lore |
|----------|:------:|:------:|:--------:|:----:|
| `AS-S01` | — | — | — | — |
| `AS-S02` | — | — | — | — |
| `AS-S03` | — | — | — | — |
| `AS-S04` | — | — | — | — |
| `AS-S05` | — | — | — | — |
| `AS-S06` | — | — | — | — |
| `AS-S07` | — | — | — | — |
| `AS-S08` | — | — | — | — |
| `AS-S09` | — | — | — | — |
| `AS-S10` | — | — | — | — |
| `AS-S11` | — | — | — | — |

### UK

| SeasonId | Season | Queens | Episodes | Lore |
|----------|:------:|:------:|:--------:|:----:|
| `UK-S01` | — | — | — | — |
| `UK-S02` | — | — | — | — |
| `UK-S03` | — | — | — | — |
| `UK-S04` | — | — | — | — |
| `UK-S05` | — | — | — | — |
| `UK-S06` | — | — | — | — |

### Canada

| SeasonId | Season | Queens | Episodes | Lore |
|----------|:------:|:------:|:--------:|:----:|
| `CA-S01` | — | — | — | — |
| `CA-S02` | — | — | — | — |
| `CA-S03` | — | — | — | — |
| `CA-S04` | — | — | — | — |
| `CA-S05` | — | — | — | — |
| `CA-S06` | — | — | — | — |
| `CVTW-S01` | — | — | — | — |
| `CVTW-S02` | — | — | — | — |
| `CAS-S01` | — | — | — | — |

### Europe

| SeasonId | Season | Queens | Episodes | Lore |
|----------|:------:|:------:|:--------:|:----:|
| `ES-S01` | — | — | — | — |
| `ES-S02` | — | — | — | — |
| `ES-S03` | — | — | — | — |
| `ES-S04` | — | — | — | — |
| `ES-S05` | — | — | — | — |
| `ESAS-S01` | — | — | — | — |
| `ESAS-S02` | — | — | — | — |
| `FR-S01` | — | — | — | — |
| `FR-S02` | — | — | — | — |
| `FR-S03` | — | — | — | — |
| `FR-S04` | — | — | — | — |
| `IT-S01` | — | — | — | — |
| `IT-S02` | — | — | — | — |
| `IT-S03` | — | — | — | — |
| `DE-S01` | — | — | — | — |
| `NL-S01` | — | — | — | — |
| `NL-S02` | — | — | — | — |
| `BE-S01` | — | — | — | — |
| `BE-S02` | — | — | — | — |
| `SE-S01` | — | — | — | — |

### Latin America

| SeasonId | Season | Queens | Episodes | Lore |
|----------|:------:|:------:|:--------:|:----:|
| `MX-S01` | — | — | — | — |
| `MX-S02` | — | — | — | — |
| `MX-S03` | — | — | — | — |
| `MXLR-S01` | — | — | — | — |
| `BR-S01` | — | — | — | — |
| `BR-S02` | — | — | — | — |

### Asia–Pacific & global

| SeasonId | Season | Queens | Episodes | Lore |
|----------|:------:|:------:|:--------:|:----:|
| `TH-S01` | — | — | — | — |
| `TH-S02` | — | — | — | — |
| `TH-S03` | — | — | — | — |
| `PH-S01` | — | — | — | — |
| `PH-S02` | — | — | — | — |
| `PH-S03` | — | — | — | — |
| `PH-S04` | — | — | — | — |
| `PHSR-S01` | — | — | — | — |
| `GAS-S01` | — | — | — | — |
| `DUVTW-S01` | — | — | — | — |

---

## Project structure

```text
├── src/
│   ├── index.ts              # MCP entry (stdio)
│   ├── server.ts             # Server + tool registration
│   ├── data/
│   │   ├── queens/           # One JSON file per QueenId
│   │   └── seasons/
│   │       └── US-S01/
│   │           ├── season.json
│   │           ├── episodes.json
│   │           └── lore.json
│   ├── types/
│   │   ├── season.ts         # SeasonId, FranchiseCode, Season
│   │   ├── queen.ts          # QueenId, Queen, appearances, wins
│   │   ├── episode.ts        # EpisodeId, Episode
│   │   ├── lore.ts           # LoreId, LoreTag, Lore
│   │   ├── money.ts          # Currency, Money
│   │   └── person.ts         # PersonRef
│   └── tools/
│       └── general/
│           ├── welcome_user.ts
│           └── index.ts
│
├── .cursor/
│   ├── mcp.json              # Local Cursor MCP config ADD WHEN YOU NEED IT.
│   └── skills/
│       └── drag-race-data/   # How to contribute season/queen JSON
│
├── package.json
├── tsconfig.json
└── README.md
```

Knowledge base JSON lives under `src/data/`. Queens are global (one file per queen). Each season is a folder `src/data/seasons/<SeasonId>/` with `season.json`, `episodes.json`, and `lore.json`. See `.cursor/skills/drag-race-data/` when contributing with an agent.

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

## Planned MCP tools

| Tool | Description |
|------|-------------|
| `welcome_user` | Smoke-test / hello (exists) |
| `list_season_ids` / `list_queen_ids` | Discover valid IDs |
| `search_queens` | Search queens by name or alias |
| `get_queen` | Full queen record |
| `get_season` | Season record + linked IDs |
| `get_episode` | Episode detail |
| `compare_queens` | Compare two or more queens |
| `search_lore` | Search lore by tag, queen, or season |
| `recommend_season` | Recommend seasons from preferences |

---

## Roadmap

### v1

- [x] Stable TypeScript interfaces (IDs + hard facts + lore)
- [ ] JSON data + Zod schemas
- [ ] Core read tools (queen / season / episode / lore)
- [ ] Local Cursor workflow documented

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
