/**
 * Psionic Darts — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs blaster_ranged psychic_blast
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { PsionicDarts as base } from '@/data/datasets/homecoming/generated/powersets/blaster/primary/psychic-blast/psionic-dart';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/blaster/primary/psychic-blast/psionic-dart';

export const PsionicDarts: Power = withOverrides(base, overrides);
