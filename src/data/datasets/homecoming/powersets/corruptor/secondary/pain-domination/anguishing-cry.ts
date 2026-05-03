/**
 * Anguishing Cry — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs corruptor_buff pain_domination
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { AnguishingCry as base } from '@/data/datasets/homecoming/generated/powersets/corruptor/secondary/pain-domination/anguishing-cry';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/corruptor/secondary/pain-domination/anguishing-cry';

export const AnguishingCry: Power = withOverrides(base, overrides);
