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
  const castQueenIds = new Set<QueenId>();

  for (const season of kb.seasons.values()) {
    for (const castId of season.castIds) {
      referencedQueenIds.add(castId);
      castQueenIds.add(castId);
    }
    for (const id of [
      ...(season.winnerIds ?? []),
      season.missCongenialityId,
      season.lipSyncAssassinId,
      ...(season.porkchopIds ?? []),
      ...season.runnerUpIds,
      ...(season.disqualifiedIds ?? []),
    ]) {
      if (!id) continue;
      referencedQueenIds.add(id);
      if (!kb.queens.has(id)) {
        errors.push(
          `season ${season.id}: queenId "${id}" does not exist`,
        );
      }
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
    if (episode.guestJudges) {
      collectPersonQueenIds(
        episode.guestJudges,
        referencedQueenIds,
        errors,
        kb.queens,
        `episode ${episode.id} guestJudges`,
      );
    }
    // Guest Lip Sync Assassins (etc.) appear in lipSync.queenIds but not castIds.
    if (episode.lipSync) {
      for (const id of episode.lipSync.queenIds) {
        referencedQueenIds.add(id);
        if (!kb.queens.has(id)) {
          errors.push(
            `episode ${episode.id} lipSync: queenId "${id}" does not exist`,
          );
        }
      }
    }
  }

  for (const queen of kb.queens.values()) {
    // Cast contestants must have appearances; guest-only lip-sync / PersonRef
    // queens may exist before their home season pack is filled.
    if (queen.appearances.length === 0 && castQueenIds.has(queen.id)) {
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
        `queen "${queen.id}" is not referenced by any castIds, lipSync.queenIds, or PersonRef queenId`,
      );
    }
  }

  if (errors.length > 0) {
    throw new Error(
      `Knowledge base integrity errors:\n${errors.map((e) => `  - ${e}`).join("\n")}`,
    );
  }
};
