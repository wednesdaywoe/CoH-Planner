/**
 * Umbral Torrent — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs sentinel_ranged dark_blast
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { UmbralTorrent as base } from '@/data/datasets/homecoming/generated/powersets/sentinel/primary/dark-blast/umbral-torrent';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/sentinel/primary/dark-blast/umbral-torrent';

export const UmbralTorrent: Power = withOverrides(base, overrides);
