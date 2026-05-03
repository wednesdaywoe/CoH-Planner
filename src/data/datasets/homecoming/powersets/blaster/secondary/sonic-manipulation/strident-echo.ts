/**
 * Strident Echo — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs blaster_support sonic_manipulation
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { StridentEcho as base } from '@/data/datasets/homecoming/generated/powersets/blaster/secondary/sonic-manipulation/strident-echo';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/blaster/secondary/sonic-manipulation/strident-echo';

export const StridentEcho: Power = withOverrides(base, overrides);
