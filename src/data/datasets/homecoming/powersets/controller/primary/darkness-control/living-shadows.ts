/**
 * Living Shadows — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs controller_control darkness_control
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { LivingShadows as base } from '@/data/generated/powersets/controller/primary/darkness-control/living-shadows';
import { overrides } from '@/data/overrides/powersets/controller/primary/darkness-control/living-shadows';

export const LivingShadows: Power = withOverrides(base, overrides);
