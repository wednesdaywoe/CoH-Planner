/**
 * Vicious Slash — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs brute_melee savage_melee
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { ViciousSlash as base } from '@/data/generated/powersets/brute/primary/savage-melee/vicious-slash';
import { overrides } from '@/data/overrides/powersets/brute/primary/savage-melee/vicious-slash';

export const ViciousSlash: Power = withOverrides(base, overrides);
