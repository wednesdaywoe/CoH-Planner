/**
 * Aura of Domination — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs brute_melee blight_melee
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { AuraofDomination as base } from '@/data/datasets/veracity/generated/powersets/brute/primary/blight-melee/aura-of-domination';
import { overrides } from '@/data/datasets/veracity/overrides/powersets/brute/primary/blight-melee/aura-of-domination';

export const AuraofDomination: Power = withOverrides(base, overrides);
