/**
 * Wild Bastion — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs defender_buff nature_affinity
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { WildBastion as base } from '@/data/datasets/homecoming/generated/powersets/defender/primary/nature-affinity/wild-bastion';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/defender/primary/nature-affinity/wild-bastion';

export const WildBastion: Power = withOverrides(base, overrides);
