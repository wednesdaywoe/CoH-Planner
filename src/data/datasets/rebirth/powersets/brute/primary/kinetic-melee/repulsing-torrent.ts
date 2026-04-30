/**
 * Repulsing Torrent — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs brute_melee kinetic_attack
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { RepulsingTorrent as base } from '@/data/datasets/rebirth/generated/powersets/brute/primary/kinetic-melee/repulsing-torrent';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/brute/primary/kinetic-melee/repulsing-torrent';

export const RepulsingTorrent: Power = withOverrides(base, overrides);
