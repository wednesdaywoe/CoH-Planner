/**
 * Practiced Brawler — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs sentinel_defense super_reflexes
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { PracticedBrawler as base } from '@/data/generated/powersets/sentinel/secondary/super-reflexes/practiced-brawler';
import { overrides } from '@/data/overrides/powersets/sentinel/secondary/super-reflexes/practiced-brawler';

export const PracticedBrawler: Power = withOverrides(base, overrides);
