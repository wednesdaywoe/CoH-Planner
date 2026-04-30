/**
 * Focus Chi — COMPOSED EXPORT
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
import { FocusChi as base } from '@/data/datasets/rebirth/generated/powersets/scrapper/primary/martial-arts/focus-chi';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/scrapper/primary/martial-arts/focus-chi';

export const FocusChi: Power = withOverrides(base, overrides);
