/**
 * Web Grenade — COMPOSED EXPORT
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
import { WebGrenade as base } from '@/data/datasets/rebirth/generated/powersets/blaster/secondary/devices/web-grenade';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/blaster/secondary/devices/web-grenade';

export const WebGrenade: Power = withOverrides(base, overrides);
