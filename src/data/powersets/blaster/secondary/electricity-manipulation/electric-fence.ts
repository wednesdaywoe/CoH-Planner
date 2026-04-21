/**
 * Electric Fence — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs blaster_support electricity_manipulation
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { ElectricFence as base } from '@/data/generated/powersets/blaster/secondary/electricity-manipulation/electric-fence';
import { overrides } from '@/data/overrides/powersets/blaster/secondary/electricity-manipulation/electric-fence';

export const ElectricFence: Power = withOverrides(base, overrides);
