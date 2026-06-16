/**
 * Soaring Dragon — COMPOSED EXPORT
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
import { Disembowel as base } from '@/data/datasets/thunderspy/generated/powersets/scrapper/primary/katana/disembowel';
import { overrides } from '@/data/datasets/thunderspy/overrides/powersets/scrapper/primary/katana/disembowel';

export const Disembowel: Power = withOverrides(base, overrides);
