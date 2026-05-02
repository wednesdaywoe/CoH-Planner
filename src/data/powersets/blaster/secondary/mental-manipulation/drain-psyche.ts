/**
 * Drain Psyche — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs blaster_support mental_manipulation
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { DrainPsyche as base } from '@/data/generated/powersets/blaster/secondary/mental-manipulation/drain-psyche';
import { overrides } from '@/data/overrides/powersets/blaster/secondary/mental-manipulation/drain-psyche';

export const DrainPsyche: Power = withOverrides(base, overrides);
