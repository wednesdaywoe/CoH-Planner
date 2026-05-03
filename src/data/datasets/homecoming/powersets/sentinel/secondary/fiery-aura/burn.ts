/**
 * Burn — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs sentinel_defense fiery_aura
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Burn as base } from '@/data/generated/powersets/sentinel/secondary/fiery-aura/burn';
import { overrides } from '@/data/overrides/powersets/sentinel/secondary/fiery-aura/burn';

export const Burn: Power = withOverrides(base, overrides);
