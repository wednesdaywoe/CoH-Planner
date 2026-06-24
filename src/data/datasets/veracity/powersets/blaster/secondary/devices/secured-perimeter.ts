/**
 * Secured Perimeter — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs blaster_support gadgets
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { SecuredPerimeter as base } from '@/data/datasets/veracity/generated/powersets/blaster/secondary/devices/secured-perimeter';
import { overrides } from '@/data/datasets/veracity/overrides/powersets/blaster/secondary/devices/secured-perimeter';

export const SecuredPerimeter: Power = withOverrides(base, overrides);
