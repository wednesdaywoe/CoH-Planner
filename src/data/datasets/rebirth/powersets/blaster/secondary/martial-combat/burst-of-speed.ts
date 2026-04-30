/**
 * Burst of Speed — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs blaster_support martial_manipulation
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { BurstofSpeed as base } from '@/data/datasets/rebirth/generated/powersets/blaster/secondary/martial-combat/burst-of-speed';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/blaster/secondary/martial-combat/burst-of-speed';

export const BurstofSpeed: Power = withOverrides(base, overrides);
