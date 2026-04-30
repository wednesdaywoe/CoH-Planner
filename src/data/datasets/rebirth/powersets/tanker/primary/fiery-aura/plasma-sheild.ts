/**
 * Plasma Shield — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs tanker_defense fiery_aura
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { PlasmaShield as base } from '@/data/datasets/rebirth/generated/powersets/tanker/primary/fiery-aura/plasma-sheild';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/tanker/primary/fiery-aura/plasma-sheild';

export const PlasmaShield: Power = withOverrides(base, overrides);
