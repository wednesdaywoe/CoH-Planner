/**
 * Gun Drone — COMPOSED EXPORT
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
import { GunDrone as base } from '@/data/datasets/homecoming/generated/powersets/blaster/secondary/devices/auto-turret';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/blaster/secondary/devices/auto-turret';

export const GunDrone: Power = withOverrides(base, overrides);
