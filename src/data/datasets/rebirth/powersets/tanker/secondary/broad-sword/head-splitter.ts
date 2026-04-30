/**
 * Head Splitter — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs tanker_melee broad_sword
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { HeadSplitter as base } from '@/data/datasets/rebirth/generated/powersets/tanker/secondary/broad-sword/head-splitter';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/tanker/secondary/broad-sword/head-splitter';

export const HeadSplitter: Power = withOverrides(base, overrides);
