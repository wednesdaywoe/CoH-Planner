/**
 * Psionic Shield — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs brute_defense psionic_armor
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { PsionicShield as base } from '@/data/generated/powersets/brute/secondary/psionic-armor/psionic-shield';
import { overrides } from '@/data/overrides/powersets/brute/secondary/psionic-armor/psionic-shield';

export const PsionicShield: Power = withOverrides(base, overrides);
