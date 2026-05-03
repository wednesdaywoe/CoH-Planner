/**
 * Savage Leap — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs tanker_melee savage_melee
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { SavageLeap as base } from '@/data/datasets/homecoming/generated/powersets/tanker/secondary/savage-melee/savage-leap';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/tanker/secondary/savage-melee/savage-leap';

export const SavageLeap: Power = withOverrides(base, overrides);
