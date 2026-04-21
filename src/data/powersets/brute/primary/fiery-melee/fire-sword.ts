/**
 * Fire Sword — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs brute_melee fiery_melee
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { FireSword as base } from '@/data/generated/powersets/brute/primary/fiery-melee/fire-sword';
import { overrides } from '@/data/overrides/powersets/brute/primary/fiery-melee/fire-sword';

export const FireSword: Power = withOverrides(base, overrides);
