/**
 * Axe Cyclone — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs tanker_melee battle_axe
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { AxeCyclone as base } from '@/data/datasets/homecoming/generated/powersets/tanker/secondary/battle-axe/whirling-axe';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/tanker/secondary/battle-axe/whirling-axe';

export const AxeCyclone: Power = withOverrides(base, overrides);
