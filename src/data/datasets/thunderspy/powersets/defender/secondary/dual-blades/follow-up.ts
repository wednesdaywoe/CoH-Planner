/**
 * Blinding Feint — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs defender_ranged dual_blades
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { FollowUp as base } from '@/data/datasets/thunderspy/generated/powersets/defender/secondary/dual-blades/follow-up';
import { overrides } from '@/data/datasets/thunderspy/overrides/powersets/defender/secondary/dual-blades/follow-up';

export const FollowUp: Power = withOverrides(base, overrides);
