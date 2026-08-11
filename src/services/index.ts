/**
 * Application services — utilities tools call over the loaded KB.
 *
 * - `accessors/` — get by id / list all ids
 * - `seasons/` `queens/` `lore/` — filtered list + search
 * - `shared/` — cross-cutting helpers (limits)
 *
 * Logic lives in named files; each folder `index.ts` only re-exports.
 */

export {
  getQueen,
  getSeason,
  getEpisode,
  getLore,
  listQueenIds,
  listSeasonIds as listAllSeasonIds,
  listEpisodeIds,
  listLoreIds,
} from "./accessors/index.ts";

export {
  DEFAULT_SEARCH_LIMIT,
  MAX_SEARCH_LIMIT,
  clampSearchLimit,
} from "./shared/index.ts";

export { listSeasonIds } from "./seasons/index.ts";

export {
  listQueenIdsForSeason,
  searchQueens,
  type QueenSearchHit,
} from "./queens/index.ts";

export { searchLore, type LoreSearchOptions } from "./lore/index.ts";
