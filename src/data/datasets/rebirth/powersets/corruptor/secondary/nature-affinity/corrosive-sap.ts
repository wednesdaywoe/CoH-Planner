/**
 * Corrosive Enzymes — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs corruptor_buff nature_affinity
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { CorrosiveEnzymes as base } from '@/data/datasets/rebirth/generated/powersets/corruptor/secondary/nature-affinity/corrosive-sap';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/corruptor/secondary/nature-affinity/corrosive-sap';

export const CorrosiveEnzymes: Power = withOverrides(base, overrides);
