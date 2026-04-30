/**
 * Force Bolt — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs defender_buff force_field
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { ForceBolt as base } from '@/data/generated/powersets/defender/primary/force-field/force-bolt';
import { overrides } from '@/data/overrides/powersets/defender/primary/force-field/force-bolt';

export const ForceBolt: Power = withOverrides(base, overrides);
