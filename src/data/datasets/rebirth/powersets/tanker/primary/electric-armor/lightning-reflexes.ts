/**
 * Lightning Reflexes — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs tanker_defense electric_armor
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { LightningReflexes as base } from '@/data/datasets/rebirth/generated/powersets/tanker/primary/electric-armor/lightning-reflexes';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/tanker/primary/electric-armor/lightning-reflexes';

export const LightningReflexes: Power = withOverrides(base, overrides);
