/**
 * Hunter's Howl — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs feral_might feral_might
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { HuntersHowl as base } from '@/data/datasets/thunderspy/generated/powersets/primalist/primary/feral-might/hunters-howl';
import { overrides } from '@/data/datasets/thunderspy/overrides/powersets/primalist/primary/feral-might/hunters-howl';

export const HuntersHowl: Power = withOverrides(base, overrides);
