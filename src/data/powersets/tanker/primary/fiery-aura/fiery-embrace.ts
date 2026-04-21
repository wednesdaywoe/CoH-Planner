/**
 * Fiery Embrace — COMPOSED EXPORT
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
import { FieryEmbrace as base } from '@/data/generated/powersets/tanker/primary/fiery-aura/fiery-embrace';
import { overrides } from '@/data/overrides/powersets/tanker/primary/fiery-aura/fiery-embrace';

export const FieryEmbrace: Power = withOverrides(base, overrides);
