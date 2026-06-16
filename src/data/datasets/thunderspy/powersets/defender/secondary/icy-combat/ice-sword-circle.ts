/**
 * Ice Sword Circle — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs defender_ranged ice_blast
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { IceSwordCircle as base } from '@/data/datasets/thunderspy/generated/powersets/defender/secondary/icy-combat/ice-sword-circle';
import { overrides } from '@/data/datasets/thunderspy/overrides/powersets/defender/secondary/icy-combat/ice-sword-circle';

export const IceSwordCircle: Power = withOverrides(base, overrides);
