/**
 * Convenience accessors over the indexed knowledge base.
 */

import type { QueenId, SeasonId } from "./catalogs.ts";
import type { Episode, Lore, Queen, Season } from "./schemas/index.ts";
import { getKb } from "./load.ts";

export const getQueen = (id: QueenId): Queen | undefined =>
  getKb().queens.get(id);

export const getSeason = (id: SeasonId): Season | undefined =>
  getKb().seasons.get(id);

export const getEpisode = (id: string): Episode | undefined =>
  getKb().episodes.get(id);

export const getLore = (id: string): Lore | undefined => getKb().lore.get(id);

export const listQueenIds = (): QueenId[] =>
  [...getKb().queens.keys()].sort();

export const listSeasonIds = (): SeasonId[] =>
  [...getKb().seasons.keys()].sort();

export const listEpisodeIds = (): string[] =>
  [...getKb().episodes.keys()].sort();

export const listLoreIds = (): string[] => [...getKb().lore.keys()].sort();
