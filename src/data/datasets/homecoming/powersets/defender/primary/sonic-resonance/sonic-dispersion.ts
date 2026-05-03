/**
 * Sonic Dispersion — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs defender_buff sonic_debuff
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { SonicDispersion as base } from '@/data/datasets/homecoming/generated/powersets/defender/primary/sonic-resonance/sonic-dispersion';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/defender/primary/sonic-resonance/sonic-dispersion';

export const SonicDispersion: Power = withOverrides(base, overrides);
