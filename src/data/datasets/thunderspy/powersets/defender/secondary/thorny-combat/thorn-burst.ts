/**
 * Thorn Burst — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs defender_ranged thorny_assault
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { ThornBurst as base } from '@/data/datasets/thunderspy/generated/powersets/defender/secondary/thorny-combat/thorn-burst';
import { overrides } from '@/data/datasets/thunderspy/overrides/powersets/defender/secondary/thorny-combat/thorn-burst';

export const ThornBurst: Power = withOverrides(base, overrides);
