/**
 * Call of the Wild — COMPOSED EXPORT
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
import { CalloftheWild as base } from '@/data/datasets/veracity/generated/powersets/primalist/primary/feral-might/call-of-the-wild';
import { overrides } from '@/data/datasets/veracity/overrides/powersets/primalist/primary/feral-might/call-of-the-wild';

export const CalloftheWild: Power = withOverrides(base, overrides);
