/**
 * Danger Sense — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs guardian_comp infiltrator_training
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { DangerSense as base } from '@/data/datasets/rebirth/generated/powersets/guardian/secondary/infiltrator-training/danger-sense';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/guardian/secondary/infiltrator-training/danger-sense';

export const DangerSense: Power = withOverrides(base, overrides);
