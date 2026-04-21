/**
 * Ice Shield — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs defender_buff cold_domination
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { IceShield as base } from '@/data/generated/powersets/defender/primary/cold-domination/ice-shield';
import { overrides } from '@/data/overrides/powersets/defender/primary/cold-domination/ice-shield';

export const IceShield: Power = withOverrides(base, overrides);
