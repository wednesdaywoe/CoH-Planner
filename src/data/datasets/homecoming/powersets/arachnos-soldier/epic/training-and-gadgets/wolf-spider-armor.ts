/**
 * Wolf Spider Armor — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs training_gadgets training_and_gadgets
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { WolfSpiderArmor as base } from '@/data/generated/powersets/arachnos-soldier/epic/training-and-gadgets/wolf-spider-armor';
import { overrides } from '@/data/overrides/powersets/arachnos-soldier/epic/training-and-gadgets/wolf-spider-armor';

export const WolfSpiderArmor: Power = withOverrides(base, overrides);
