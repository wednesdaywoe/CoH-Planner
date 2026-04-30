/**
 * Psionic Tornado — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs widow_training fortunata_training
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { PsionicTornado as base } from '@/data/generated/powersets/arachnos-widow/epic/fortunata-training/frt-psionic-lance';
import { overrides } from '@/data/overrides/powersets/arachnos-widow/epic/fortunata-training/frt-psionic-lance';

export const PsionicTornado: Power = withOverrides(base, overrides);
