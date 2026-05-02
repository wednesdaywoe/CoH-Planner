/**
 * Adrenalin Boost — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs controller_buff empathy
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { AdrenalinBoost as base } from '@/data/generated/powersets/controller/secondary/empathy/adrenalin-boost';
import { overrides } from '@/data/overrides/powersets/controller/secondary/empathy/adrenalin-boost';

export const AdrenalinBoost: Power = withOverrides(base, overrides);
