/**
 * Eagles Claw — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs brute_melee martial_arts
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { EaglesClaw as base } from '@/data/generated/powersets/brute/primary/martial-arts/eagles-claw';
import { overrides } from '@/data/overrides/powersets/brute/primary/martial-arts/eagles-claw';

export const EaglesClaw: Power = withOverrides(base, overrides);
