/**
 * Calling the Wolf — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs scrapper_melee katana
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { CallingtheWolf as base } from '@/data/generated/powersets/scrapper/primary/katana/taunt';
import { overrides } from '@/data/overrides/powersets/scrapper/primary/katana/taunt';

export const CallingtheWolf: Power = withOverrides(base, overrides);
