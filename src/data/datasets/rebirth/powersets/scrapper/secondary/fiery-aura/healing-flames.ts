/**
 * Healing Flames — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs scrapper_defense fiery_aura
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { HealingFlames as base } from '@/data/datasets/rebirth/generated/powersets/scrapper/secondary/fiery-aura/healing-flames';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/scrapper/secondary/fiery-aura/healing-flames';

export const HealingFlames: Power = withOverrides(base, overrides);
