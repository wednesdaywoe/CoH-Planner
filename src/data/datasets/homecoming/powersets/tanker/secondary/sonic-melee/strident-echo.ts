/**
 * Strident Echo — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs tanker_melee sonic_melee
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { StridentEcho as base } from '@/data/generated/powersets/tanker/secondary/sonic-melee/strident-echo';
import { overrides } from '@/data/overrides/powersets/tanker/secondary/sonic-melee/strident-echo';

export const StridentEcho: Power = withOverrides(base, overrides);
