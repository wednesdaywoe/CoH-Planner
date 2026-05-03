/**
 * Icy Bastion — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs stalker_defense ice_armor
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { IcyBastion as base } from '@/data/datasets/homecoming/generated/powersets/stalker/secondary/ice-armor/icy-bastion';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/stalker/secondary/ice-armor/icy-bastion';

export const IcyBastion: Power = withOverrides(base, overrides);
