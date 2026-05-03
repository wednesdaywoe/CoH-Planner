/**
 * Fire Shield — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs brute_defense fiery_aura
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { FireShield as base } from '@/data/datasets/homecoming/generated/powersets/brute/secondary/fiery-aura/fire-shield';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/brute/secondary/fiery-aura/fire-shield';

export const FireShield: Power = withOverrides(base, overrides);
