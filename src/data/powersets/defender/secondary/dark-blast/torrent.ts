/**
 * Torrent — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs defender_ranged dark_blast
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Torrent as base } from '@/data/generated/powersets/defender/secondary/dark-blast/torrent';
import { overrides } from '@/data/overrides/powersets/defender/secondary/dark-blast/torrent';

export const Torrent: Power = withOverrides(base, overrides);
