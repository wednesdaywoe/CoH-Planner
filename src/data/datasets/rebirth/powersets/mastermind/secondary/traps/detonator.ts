/**
 * Detonator — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs mastermind_buff traps
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Detonator as base } from '@/data/generated/powersets/mastermind/secondary/traps/detonator';
import { overrides } from '@/data/overrides/powersets/mastermind/secondary/traps/detonator';

export const Detonator: Power = withOverrides(base, overrides);
