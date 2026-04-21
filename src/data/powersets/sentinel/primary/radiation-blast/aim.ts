/**
 * Aim — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs sentinel_ranged radiation_blast
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Aim as base } from '@/data/generated/powersets/sentinel/primary/radiation-blast/aim';
import { overrides } from '@/data/overrides/powersets/sentinel/primary/radiation-blast/aim';

export const Aim: Power = withOverrides(base, overrides);
