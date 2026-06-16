/**
 * Epic/Patron Pool overrides — hand-written deltas keyed by a power's
 * `fullName`. The composed facade (epic-pools-raw.ts) merges each entry
 * into its matching generated power.
 *
 * Empty record means no overrides. See src/data/README.md for the
 * layering convention.
 */
import type { Power } from '@/types';

export const EPIC_POOL_OVERRIDES: Record<string, Partial<Power>> = {};
