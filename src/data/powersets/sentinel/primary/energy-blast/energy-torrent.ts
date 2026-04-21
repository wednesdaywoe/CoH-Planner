/**
 * Energy Torrent — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs sentinel_ranged energy_blast
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { EnergyTorrent as base } from '@/data/generated/powersets/sentinel/primary/energy-blast/energy-torrent';
import { overrides } from '@/data/overrides/powersets/sentinel/primary/energy-blast/energy-torrent';

export const EnergyTorrent: Power = withOverrides(base, overrides);
