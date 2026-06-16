/**
 * Murky Cloud — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs scrapper_defense dark_armor
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Defractingcloud as base } from '@/data/datasets/thunderspy/generated/powersets/scrapper/secondary/dark-armor/defracting-cloud';
import { overrides } from '@/data/datasets/thunderspy/overrides/powersets/scrapper/secondary/dark-armor/defracting-cloud';

export const Defractingcloud: Power = withOverrides(base, overrides);
