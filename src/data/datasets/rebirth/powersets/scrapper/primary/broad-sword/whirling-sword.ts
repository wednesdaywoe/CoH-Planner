/**
 * Whirling Sword — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs scrapper_melee broad_sword
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { WhirlingSword as base } from '@/data/datasets/rebirth/generated/powersets/scrapper/primary/broad-sword/whirling-sword';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/scrapper/primary/broad-sword/whirling-sword';

export const WhirlingSword: Power = withOverrides(base, overrides);
