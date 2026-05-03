/**
 * Dominate Will — COMPOSED EXPORT
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
import { DominateWill as base } from '@/data/datasets/homecoming/generated/powersets/blaster/primary/psychic-blast/will-domination';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/blaster/primary/psychic-blast/will-domination';

export const DominateWill: Power = withOverrides(base, overrides);
