/**
 * Focused Senses — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs scrapper_defense super_reflexes
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { FocusedSenses as base } from '@/data/generated/powersets/scrapper/secondary/super-reflexes/focused-senses';
import { overrides } from '@/data/overrides/powersets/scrapper/secondary/super-reflexes/focused-senses';

export const FocusedSenses: Power = withOverrides(base, overrides);
