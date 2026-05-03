/**
 * White Dwarf Flare — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs peacebringer_defensive luminous_aura
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { WhiteDwarfFlare as base } from '@/data/datasets/homecoming/generated/powersets/peacebringer/epic/luminous-aura/white-dwarf-flare';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/peacebringer/epic/luminous-aura/white-dwarf-flare';

export const WhiteDwarfFlare: Power = withOverrides(base, overrides);
