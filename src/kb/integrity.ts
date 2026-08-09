/**
 * Cross-file integrity checks for a loaded knowledge base.
 */

import type { QueenId } from "./catalogs.ts";
import type { KnowledgeBase } from "./load.ts";
import type { PersonRef } from "./schemas/index.ts";

const collectPersonQueenIds = (
  people: PersonRef[],
  referenced: Set<QueenId>,
  missing: string[],
  queens: KnowledgeBase["queens"],
  location: string,
): void => {
  for (const person of people) {
    if (!person.queenId) continue;
    referenced.add(person.queenId);
    if (!queens.has(person.queenId)) {
      missing.push(
        `${location}: queenId "${person.queenId}" does not exist`,
      );
    }
  }
};

export const assertKnowledgeBaseIntegrity = (kb: KnowledgeBase): void => {
  const errors: string[] = [];
  const referencedQueenIds = new Set<QueenId>();

  for (const season of kb.seasons.values()) {
    for (const castId of season.castIds) {
      referencedQueenIds.add(castId);
    }
    collectPersonQueenIds(
      season.hosts,
      referencedQueenIds,
      errors,
      kb.queens,
      `season ${season.id} hosts`,
    );
    collectPersonQueenIds(
      season.judges,
      referencedQueenIds,
      errors,
      kb.queens,
      `season ${season.id} judges`,
    );
  }

  for (const episode of kb.episodes.values()) {
    if (!episode.guestJudges) continue;
    collectPersonQueenIds(
      episode.guestJudges,
      referencedQueenIds,
      errors,
      kb.queens,
      `episode ${episode.id} guestJudges`,
    );
  }

  for (const queen of kb.queens.values()) {
    if (queen.appearances.length === 0) {
      errors.push(`queen "${queen.id}" has no appearances`);
    }

    const seenSeasonIds = new Set<string>();
    for (const appearance of queen.appearances) {
      if (seenSeasonIds.has(appearance.seasonId)) {
        errors.push(
          `queen "${queen.id}" has duplicate appearance for season "${appearance.seasonId}"`,
        );
      }
      seenSeasonIds.add(appearance.seasonId);

      if (!kb.seasons.has(appearance.seasonId)) {
        errors.push(
          `queen "${queen.id}" appearance references missing season "${appearance.seasonId}"`,
        );
      }
    }

    if (!referencedQueenIds.has(queen.id)) {
      errors.push(
        `queen "${queen.id}" is not referenced by any castIds or PersonRef queenId`,
      );
    }
  }

  if (errors.length > 0) {
    throw new Error(
      `Knowledge base integrity errors:\n${errors.map((e) => `  - ${e}`).join("\n")}`,
    );
  }
};
