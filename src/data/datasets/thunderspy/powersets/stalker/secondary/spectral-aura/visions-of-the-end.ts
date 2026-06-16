/**
 * Visions Of The End — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs stalker_defense spectral_aura
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { VisionsOfTheEnd as base } from '@/data/datasets/thunderspy/generated/powersets/stalker/secondary/spectral-aura/visions-of-the-end';
import { overrides } from '@/data/datasets/thunderspy/overrides/powersets/stalker/secondary/spectral-aura/visions-of-the-end';

export const VisionsOfTheEnd: Power = withOverrides(base, overrides);
