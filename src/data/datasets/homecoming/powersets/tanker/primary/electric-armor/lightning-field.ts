/**
 * Lightning Field — COMPOSED EXPORT
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
import { LightningField as base } from '@/data/datasets/homecoming/generated/powersets/tanker/primary/electric-armor/lightning-field';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/tanker/primary/electric-armor/lightning-field';

export const LightningField: Power = withOverrides(base, overrides);
