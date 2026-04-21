/**
 * Devour Psyche — COMPOSED EXPORT
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
import { DevourPsyche as base } from '@/data/generated/powersets/scrapper/secondary/psionic-armor/devour-psyche';
import { overrides } from '@/data/overrides/powersets/scrapper/secondary/psionic-armor/devour-psyche';

export const DevourPsyche: Power = withOverrides(base, overrides);
