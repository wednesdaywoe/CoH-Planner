/**
 * Plasma Shield — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs stalker_defense fiery_aura
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { PlasmaShield as base } from '@/data/generated/powersets/stalker/secondary/fiery-aura/plasma-shield';
import { overrides } from '@/data/overrides/powersets/stalker/secondary/fiery-aura/plasma-shield';

export const PlasmaShield: Power = withOverrides(base, overrides);
