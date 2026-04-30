/**
 * White Dwarf Step — COMPOSED EXPORT
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
import { WhiteDwarfStep as base } from '@/data/datasets/rebirth/generated/powersets/peacebringer/epic/luminous-aura/white-dwarf-step';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/peacebringer/epic/luminous-aura/white-dwarf-step';

export const WhiteDwarfStep: Power = withOverrides(base, overrides);
