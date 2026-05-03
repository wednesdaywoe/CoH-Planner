/**
 * Personal Force Field — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs mastermind_buff force_field
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { PersonalForceField as base } from '@/data/datasets/homecoming/generated/powersets/mastermind/secondary/force-field/personal-force-field';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/mastermind/secondary/force-field/personal-force-field';

export const PersonalForceField: Power = withOverrides(base, overrides);
