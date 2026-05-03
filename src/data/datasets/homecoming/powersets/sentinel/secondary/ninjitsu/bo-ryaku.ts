/**
 * Bo Ryaku — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs sentinel_defense ninjitsu
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { BoRyaku as base } from '@/data/datasets/homecoming/generated/powersets/sentinel/secondary/ninjitsu/bo-ryaku';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/sentinel/secondary/ninjitsu/bo-ryaku';

export const BoRyaku: Power = withOverrides(base, overrides);
