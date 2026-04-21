/**
 * Sonic Siphon — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs controller_buff sonic_debuff
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { SonicSiphon as base } from '@/data/generated/powersets/controller/secondary/sonic-resonance/sonic-siphon';
import { overrides } from '@/data/overrides/powersets/controller/secondary/sonic-resonance/sonic-siphon';

export const SonicSiphon: Power = withOverrides(base, overrides);
