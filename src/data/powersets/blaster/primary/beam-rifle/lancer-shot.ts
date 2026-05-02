/**
 * Lancer Shot — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs blaster_ranged beam_rifle
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { LancerShot as base } from '@/data/generated/powersets/blaster/primary/beam-rifle/lancer-shot';
import { overrides } from '@/data/overrides/powersets/blaster/primary/beam-rifle/lancer-shot';

export const LancerShot: Power = withOverrides(base, overrides);
