/**
 * Freezing Touch — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs defender_ranged ice_blast
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { FreezingTouch as base } from '@/data/datasets/thunderspy/generated/powersets/defender/secondary/icy-combat/freezing-touch';
import { overrides } from '@/data/datasets/thunderspy/overrides/powersets/defender/secondary/icy-combat/freezing-touch';

export const FreezingTouch: Power = withOverrides(base, overrides);
