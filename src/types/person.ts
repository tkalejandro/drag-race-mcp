/**
 * Host / judge reference on a season.
 * Use `name` for display; set `queenId` when the person is also a queen in the KB.
 */

import type { QueenId } from "./queen.ts";

/**
 * Lightweight person pointer for hosts and judges.
 * Names may repeat across seasons — preferred over a separate Person catalog for now.
 */
export interface PersonRef {
  /** Display name, e.g. "Michelle Visage", "RuPaul". */
  name: string;
  /**
   * Queen ID when this person is also a competing queen
   * (e.g. Brooke Lynn Hytes, Jimbo).
   */
  queenId?: QueenId;
}
