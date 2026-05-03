/**
 * Heal Other — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs mastermind_buff empathy
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { HealOther as base } from '@/data/datasets/homecoming/generated/powersets/mastermind/secondary/empathy/heal-other';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/mastermind/secondary/empathy/heal-other';

export const HealOther: Power = withOverrides(base, overrides);
