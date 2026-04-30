/**
 * Power Surge — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs scrapper_defense electric_armor
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { PowerSurge as base } from '@/data/datasets/rebirth/generated/powersets/scrapper/secondary/electric-armor/power-surge';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/scrapper/secondary/electric-armor/power-surge';

export const PowerSurge: Power = withOverrides(base, overrides);
