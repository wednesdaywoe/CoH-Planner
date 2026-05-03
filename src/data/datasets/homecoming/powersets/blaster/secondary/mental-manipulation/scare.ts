/**
 * Scare — COMPOSED EXPORT
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
import { Scare as base } from '@/data/datasets/homecoming/generated/powersets/blaster/secondary/mental-manipulation/scare';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/blaster/secondary/mental-manipulation/scare';

export const Scare: Power = withOverrides(base, overrides);
