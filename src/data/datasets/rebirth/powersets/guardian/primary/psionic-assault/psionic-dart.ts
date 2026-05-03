/**
 * Psionic Dart — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs guardian_assault psionic_assault
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { PsionicDart as base } from '@/data/datasets/rebirth/generated/powersets/guardian/primary/psionic-assault/psionic-dart';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/guardian/primary/psionic-assault/psionic-dart';

export const PsionicDart: Power = withOverrides(base, overrides);
