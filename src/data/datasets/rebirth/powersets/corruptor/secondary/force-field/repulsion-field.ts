/**
 * Containment Shell — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs corruptor_buff force_field
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { ContainmentShell as base } from '@/data/generated/powersets/corruptor/secondary/force-field/repulsion-field';
import { overrides } from '@/data/overrides/powersets/corruptor/secondary/force-field/repulsion-field';

export const ContainmentShell: Power = withOverrides(base, overrides);
