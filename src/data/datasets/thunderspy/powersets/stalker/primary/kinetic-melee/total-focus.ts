/**
 * Concentrated Strike — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs stalker_melee kinetic_attack
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { TotalFocus as base } from '@/data/datasets/thunderspy/generated/powersets/stalker/primary/kinetic-melee/total-focus';
import { overrides } from '@/data/datasets/thunderspy/overrides/powersets/stalker/primary/kinetic-melee/total-focus';

export const TotalFocus: Power = withOverrides(base, overrides);
