/**
 * Kinetic Bolt — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs defender_ranged kinetic_assault
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { KineticBolt as base } from '@/data/datasets/thunderspy/generated/powersets/defender/secondary/kinetic-assault/kinetic-bolt';
import { overrides } from '@/data/datasets/thunderspy/overrides/powersets/defender/secondary/kinetic-assault/kinetic-bolt';

export const KineticBolt: Power = withOverrides(base, overrides);
