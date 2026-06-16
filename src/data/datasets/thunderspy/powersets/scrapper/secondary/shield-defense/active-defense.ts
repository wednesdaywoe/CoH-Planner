/**
 * Deflection — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs scrapper_defense shield_defense
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { ActiveDefense as base } from '@/data/datasets/thunderspy/generated/powersets/scrapper/secondary/shield-defense/active-defense';
import { overrides } from '@/data/datasets/thunderspy/overrides/powersets/scrapper/secondary/shield-defense/active-defense';

export const ActiveDefense: Power = withOverrides(base, overrides);
