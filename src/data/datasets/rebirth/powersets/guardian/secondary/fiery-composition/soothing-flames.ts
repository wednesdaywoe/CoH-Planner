/**
 * Soothing Flames — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs guardian_comp fiery_composition
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { SoothingFlames as base } from '@/data/datasets/rebirth/generated/powersets/guardian/secondary/fiery-composition/soothing-flames';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/guardian/secondary/fiery-composition/soothing-flames';

export const SoothingFlames: Power = withOverrides(base, overrides);
