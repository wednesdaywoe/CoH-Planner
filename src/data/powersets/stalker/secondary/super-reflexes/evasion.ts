/**
 * Evasion — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs stalker_defense super_reflexes
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Evasion as base } from '@/data/generated/powersets/stalker/secondary/super-reflexes/evasion';
import { overrides } from '@/data/overrides/powersets/stalker/secondary/super-reflexes/evasion';

export const Evasion: Power = withOverrides(base, overrides);
