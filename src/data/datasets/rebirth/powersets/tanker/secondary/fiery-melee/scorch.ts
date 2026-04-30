/**
 * Scorch — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs tanker_melee fiery_melee
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Scorch as base } from '@/data/generated/powersets/tanker/secondary/fiery-melee/scorch';
import { overrides } from '@/data/overrides/powersets/tanker/secondary/fiery-melee/scorch';

export const Scorch: Power = withOverrides(base, overrides);
