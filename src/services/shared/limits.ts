/**
 * Shared search pagination defaults.
 */

/** Default max hits when a search omits `limit`. */
export const DEFAULT_SEARCH_LIMIT = 20;

/** Hard ceiling for search result counts. */
export const MAX_SEARCH_LIMIT = 50;

/**
 * Normalize an optional search limit: use the default if missing, then clamp
 * to `[1, MAX_SEARCH_LIMIT]`.
 */
export const clampSearchLimit = (limit?: number): number => {
  if (limit === undefined) return DEFAULT_SEARCH_LIMIT;
  return Math.min(Math.max(1, Math.floor(limit)), MAX_SEARCH_LIMIT);
};
