/**
 * Ablating Strike — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs scrapper_melee dual_blades
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { AblatingStrike as base } from '@/data/datasets/rebirth/generated/powersets/scrapper/primary/dual-blades/moderate-bridge';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/scrapper/primary/dual-blades/moderate-bridge';

export const AblatingStrike: Power = withOverrides(base, overrides);
