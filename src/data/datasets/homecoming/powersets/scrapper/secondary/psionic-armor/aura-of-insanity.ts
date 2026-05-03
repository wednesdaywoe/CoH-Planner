/**
 * Aura of Insanity — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs scrapper_defense psionic_armor
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { AuraofInsanity as base } from '@/data/datasets/homecoming/generated/powersets/scrapper/secondary/psionic-armor/aura-of-insanity';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/scrapper/secondary/psionic-armor/aura-of-insanity';

export const AuraofInsanity: Power = withOverrides(base, overrides);
