/**
 * Dark Nova Detonation — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs warshade_offensive umbral_blast
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { DarkNovaDetonation as base } from '@/data/datasets/homecoming/generated/powersets/warshade/epic/umbral-blast/dark-nova-detonation';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/warshade/epic/umbral-blast/dark-nova-detonation';

export const DarkNovaDetonation: Power = withOverrides(base, overrides);
