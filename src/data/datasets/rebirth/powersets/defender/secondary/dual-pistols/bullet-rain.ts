/**
 * Bullet Rain — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs defender_ranged dual_pistols
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { BulletRain as base } from '@/data/datasets/rebirth/generated/powersets/defender/secondary/dual-pistols/bullet-rain';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/defender/secondary/dual-pistols/bullet-rain';

export const BulletRain: Power = withOverrides(base, overrides);
