/**
 * Agile — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs tanker_defense super_reflexes
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Agile as base } from '@/data/datasets/rebirth/generated/powersets/tanker/primary/super-reflexes/agile';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/tanker/primary/super-reflexes/agile';

export const Agile: Power = withOverrides(base, overrides);
