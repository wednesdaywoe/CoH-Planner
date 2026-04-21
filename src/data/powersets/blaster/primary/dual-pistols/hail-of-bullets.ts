/**
 * Hail of Bullets — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs blaster_ranged dual_pistols
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { HailofBullets as base } from '@/data/generated/powersets/blaster/primary/dual-pistols/hail-of-bullets';
import { overrides } from '@/data/overrides/powersets/blaster/primary/dual-pistols/hail-of-bullets';

export const HailofBullets: Power = withOverrides(base, overrides);
