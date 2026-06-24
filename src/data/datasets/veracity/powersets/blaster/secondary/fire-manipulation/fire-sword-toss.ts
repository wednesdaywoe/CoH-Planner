/**
 * Fire Sword Toss — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs blaster_support fire_manipulation
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { FireSwordToss as base } from '@/data/datasets/veracity/generated/powersets/blaster/secondary/fire-manipulation/fire-sword-toss';
import { overrides } from '@/data/datasets/veracity/overrides/powersets/blaster/secondary/fire-manipulation/fire-sword-toss';

export const FireSwordToss: Power = withOverrides(base, overrides);
