/**
 * Epic/Patron Pool overrides — hand-written deltas keyed by a power's
 * `fullName` (e.g. `Epic.VEAT_Leviathan_Mastery.Spirit_Shark`). The
 * composed facade (src/data/epic-pools-raw.ts) merges each entry into
 * its matching generated power via `withOverrides`.
 *
 * Empty record means no overrides. Add entries here when the stale
 * CoD2 raw extraction disagrees with current HC game values. See
 * src/data/README.md for the layering convention.
 */
import type { Power } from '@/types';

export const EPIC_POOL_OVERRIDES: Record<string, Partial<Power>> = {};
