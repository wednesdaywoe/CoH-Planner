/**
 * Slash — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs scrapper_melee claws
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Slash as base } from '@/data/datasets/homecoming/generated/powersets/scrapper/primary/claws/slash';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/scrapper/primary/claws/slash';

export const Slash: Power = withOverrides(base, overrides);
