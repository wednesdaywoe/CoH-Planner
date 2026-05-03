/**
 * Impenetrable Mind — COMPOSED EXPORT
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
import { ImpenetrableMind as base } from '@/data/generated/powersets/scrapper/secondary/psionic-armor/impenetrable-mind';
import { overrides } from '@/data/overrides/powersets/scrapper/secondary/psionic-armor/impenetrable-mind';

export const ImpenetrableMind: Power = withOverrides(base, overrides);
