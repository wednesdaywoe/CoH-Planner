/**
 * Crane Kick — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs scrapper_melee martial_arts
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { CraneKick as base } from '@/data/datasets/homecoming/generated/powersets/scrapper/primary/martial-arts/crane-kick';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/scrapper/primary/martial-arts/crane-kick';

export const CraneKick: Power = withOverrides(base, overrides);
