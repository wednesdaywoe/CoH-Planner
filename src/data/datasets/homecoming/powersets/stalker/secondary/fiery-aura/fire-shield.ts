/**
 * Fire Shield — COMPOSED EXPORT
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
import { FireShield as base } from '@/data/generated/powersets/stalker/secondary/fiery-aura/fire-shield';
import { overrides } from '@/data/overrides/powersets/stalker/secondary/fiery-aura/fire-shield';

export const FireShield: Power = withOverrides(base, overrides);
