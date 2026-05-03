/**
 * Typhoon's Edge — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs tanker_melee dual_blades
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { TyphoonsEdge as base } from '@/data/datasets/homecoming/generated/powersets/tanker/secondary/dual-blades/aoe-bridge';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/tanker/secondary/dual-blades/aoe-bridge';

export const TyphoonsEdge: Power = withOverrides(base, overrides);
