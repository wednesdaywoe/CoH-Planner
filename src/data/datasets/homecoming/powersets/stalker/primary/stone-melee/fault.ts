/**
 * Fault — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs stalker_melee stone_melee
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Fault as base } from '@/data/generated/powersets/stalker/primary/stone-melee/fault';
import { overrides } from '@/data/overrides/powersets/stalker/primary/stone-melee/fault';

export const Fault: Power = withOverrides(base, overrides);
