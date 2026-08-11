/**
 * Thin getters over the indexed knowledge base Maps.
 */

import type { QueenId, SeasonId } from "../../kb/catalogs.ts";
import type { Episode, Lore, Queen, Season } from "../../kb/schemas/index.ts";
import { getKb } from "../../kb/load.ts";

/** Look up one queen by id. */
export const getQueen = (id: QueenId): Queen | undefined =>
  getKb().queens.get(id);

/** Look up one season by id. */
export const getSeason = (id: SeasonId): Season | undefined =>
  getKb().seasons.get(id);

/** Look up one episode by id. */
export const getEpisode = (id: string): Episode | undefined =>
  getKb().episodes.get(id);

/** Look up one lore entry by id. */
export const getLore = (id: string): Lore | undefined => getKb().lore.get(id);

/** All loaded queen ids, sorted. */
export const listQueenIds = (): QueenId[] =>
  [...getKb().queens.keys()].sort();

/** All loaded season ids, sorted (no region filter). */
export const listSeasonIds = (): SeasonId[] =>
  [...getKb().seasons.keys()].sort();

/** All loaded episode ids, sorted. */
export const listEpisodeIds = (): string[] =>
  [...getKb().episodes.keys()].sort();

/** All loaded lore ids, sorted. */
export const listLoreIds = (): string[] => [...getKb().lore.keys()].sort();
