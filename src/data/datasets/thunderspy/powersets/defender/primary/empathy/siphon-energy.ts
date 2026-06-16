/**
 * Healing Aura — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs defender_buff empathy
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { SiphonEnergy as base } from '@/data/datasets/thunderspy/generated/powersets/defender/primary/empathy/siphon-energy';
import { overrides } from '@/data/datasets/thunderspy/overrides/powersets/defender/primary/empathy/siphon-energy';

export const SiphonEnergy: Power = withOverrides(base, overrides);
