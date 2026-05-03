/**
 * Galvanic Sentinel — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs controller_buff shock_therapy
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { GalvanicSentinel as base } from '@/data/generated/powersets/controller/secondary/electrical-affinity/discharge';
import { overrides } from '@/data/overrides/powersets/controller/secondary/electrical-affinity/discharge';

export const GalvanicSentinel: Power = withOverrides(base, overrides);
