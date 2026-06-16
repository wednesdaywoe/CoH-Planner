/**
 * Hallucinogenic Spray — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs controller_buff poison
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { HallucinogenicSpray as base } from '@/data/datasets/thunderspy/generated/powersets/controller/secondary/poison/hallucinogenic-spray';
import { overrides } from '@/data/datasets/thunderspy/overrides/powersets/controller/secondary/poison/hallucinogenic-spray';

export const HallucinogenicSpray: Power = withOverrides(base, overrides);
