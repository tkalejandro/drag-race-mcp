---
name: drag-race-data
description: >-
  Contribute or fix Drag Race MCP knowledge-base JSON under src/data (seasons,
  queens, episodes, lore). Use when adding a season pack, editing queen files,
  filling coverage checklist cells, or when the user asks how data should be
  structured.
---

# Drag Race MCP — data contribution

## Layout

```text
src/data/
  queens/{queen-id}.json          # one Queen per file (global)
  seasons/<SeasonId>/
    season.json                   # Season object
    episodes.json                 # Episode[]
    lore.json                     # Lore[] (omit only if empty)
```

Folder name must equal `SeasonId` exactly (e.g. `US-S01`, not `us-s01`).

Schema contract: `src/kb/catalogs.ts` + `src/kb/schemas/`.

## IDs

| ID | Format | Example |
|----|--------|---------|
| `SeasonId` | `{FRANCHISE}-S{NN}` | `US-S01` |
| `EpisodeId` | `{SeasonId}-E{NN}` | `US-S01-E05` |
| `QueenId` | kebab-case slug | `bebe-zahara-benet` |
| `LoreId` | kebab-case slug | `porkchop-origin` |

Link by IDs only — never nest full queen/season objects.

## Source-first (do not invent)

1. Research public sources (Wikipedia season page, progress table, episode list; Fandom for songs/guests/minis when WP is thin).
2. Write JSON from the source — not from memory.
3. If an optional field is unclear, **omit it**. Do not guess prize amounts, song titles, mini winners, or guest judges.
4. Episodes own weekly outcomes. Queen `challengeWins` / `miniChallengeWins` / `lipSyncWins` / `lipSyncLosses` must mirror those `episodeId`s (`lipSyncLosses` = in `lipSync.queenIds` but not in `winnerIds`).
5. `season.json` cast/winner/runner-up/Miss C/porkchop/episodeIds must match queen + episode files.
6. Returning queens: append to the same `queens/{id}.json` `appearances[]` — do not duplicate files.

## Lore

- Put entries in the **primary** season’s `lore.json`.
- Summaries stay factual and grounded in hard facts already in the pack.
- Always set `tags` and link `queenIds` / `seasonIds` / `episodeIds` when relevant.
- Cross-season stories still live under one primary folder; list every related season in `seasonIds`.

## After filling a season

1. Cross-check IDs and win/elim consistency across the three season files + queen files.
2. Flip matching cells in README **Data coverage** from `—` to `✅` (Season / Queens / Episodes / Lore).

## Reference pack

`src/data/seasons/US-S01/` + its nine queen files under `src/data/queens/` are the canonical example.
