/**
 * Dragon's Roar — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs brute_melee katana
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { DragonsRoar as base } from '@/data/datasets/rebirth/generated/powersets/brute/primary/katana/taunt';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/brute/primary/katana/taunt';

export const DragonsRoar: Power = withOverrides(base, overrides);
