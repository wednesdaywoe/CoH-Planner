/**
 * Seeker Drones — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs controller_buff traps
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { SeekerDrones as base } from '@/data/datasets/homecoming/generated/powersets/controller/secondary/traps/seeker-drones';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/controller/secondary/traps/seeker-drones';

export const SeekerDrones: Power = withOverrides(base, overrides);
