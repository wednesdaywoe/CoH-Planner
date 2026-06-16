/**
 * Greater Fire Sword — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs defender_ranged fire_blast
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { GreaterFireSword as base } from '@/data/datasets/thunderspy/generated/powersets/defender/secondary/fiery-combat/greater-fire-sword';
import { overrides } from '@/data/datasets/thunderspy/overrides/powersets/defender/secondary/fiery-combat/greater-fire-sword';

export const GreaterFireSword: Power = withOverrides(base, overrides);
