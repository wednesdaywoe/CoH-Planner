/**
 * Divine Avalanche — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs scrapper_melee katana
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { DivineAvalanche as base } from '@/data/datasets/homecoming/generated/powersets/scrapper/primary/katana/parry';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/scrapper/primary/katana/parry';

export const DivineAvalanche: Power = withOverrides(base, overrides);
