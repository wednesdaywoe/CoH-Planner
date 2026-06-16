/**
 * Pulverize — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs defender_ranged war_mace
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Pulverize as base } from '@/data/datasets/thunderspy/generated/powersets/defender/secondary/war-mace/pulverize';
import { overrides } from '@/data/datasets/thunderspy/overrides/powersets/defender/secondary/war-mace/pulverize';

export const Pulverize: Power = withOverrides(base, overrides);
