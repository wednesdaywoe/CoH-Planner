/**
 * Spin — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs defender_ranged claws
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Spin as base } from '@/data/datasets/thunderspy/generated/powersets/defender/secondary/claws/spin';
import { overrides } from '@/data/datasets/thunderspy/overrides/powersets/defender/secondary/claws/spin';

export const Spin: Power = withOverrides(base, overrides);
