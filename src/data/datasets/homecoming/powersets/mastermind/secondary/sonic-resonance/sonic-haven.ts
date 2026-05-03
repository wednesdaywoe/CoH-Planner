/**
 * Sonic Haven — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs mastermind_buff sonic_resonance
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { SonicHaven as base } from '@/data/generated/powersets/mastermind/secondary/sonic-resonance/sonic-haven';
import { overrides } from '@/data/overrides/powersets/mastermind/secondary/sonic-resonance/sonic-haven';

export const SonicHaven: Power = withOverrides(base, overrides);
