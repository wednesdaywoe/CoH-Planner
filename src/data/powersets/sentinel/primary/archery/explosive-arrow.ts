/**
 * Explosive Arrow — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs sentinel_ranged archery
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { ExplosiveArrow as base } from '@/data/generated/powersets/sentinel/primary/archery/explosive-arrow';
import { overrides } from '@/data/overrides/powersets/sentinel/primary/archery/explosive-arrow';

export const ExplosiveArrow: Power = withOverrides(base, overrides);
