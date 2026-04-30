/**
 * Force Field Generator — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs defender_buff traps
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { ForceFieldGenerator as base } from '@/data/generated/powersets/defender/primary/traps/force-field-generator';
import { overrides } from '@/data/overrides/powersets/defender/primary/traps/force-field-generator';

export const ForceFieldGenerator: Power = withOverrides(base, overrides);
