/**
 * Shadowy Binds — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs dominator_control darkness_control
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { ShadowyBinds as base } from '@/data/datasets/homecoming/generated/powersets/dominator/primary/darkness-control/shadowy-binds';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/dominator/primary/darkness-control/shadowy-binds';

export const ShadowyBinds: Power = withOverrides(base, overrides);
