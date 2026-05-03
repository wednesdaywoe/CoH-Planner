/**
 * Cauterizing Aura — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs blaster_support fire_manipulation
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { CauterizingAura as base } from '@/data/datasets/homecoming/generated/powersets/blaster/secondary/fire-manipulation/blazing-aura';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/blaster/secondary/fire-manipulation/blazing-aura';

export const CauterizingAura: Power = withOverrides(base, overrides);
