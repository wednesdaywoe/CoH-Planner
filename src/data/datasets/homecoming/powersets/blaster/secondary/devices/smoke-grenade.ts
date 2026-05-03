/**
 * Smoke Grenade — COMPOSED EXPORT
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
import { SmokeGrenade as base } from '@/data/generated/powersets/blaster/secondary/devices/smoke-grenade';
import { overrides } from '@/data/overrides/powersets/blaster/secondary/devices/smoke-grenade';

export const SmokeGrenade: Power = withOverrides(base, overrides);
