/**
 * Field Operative — COMPOSED EXPORT
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
import { FieldOperative as base } from '@/data/generated/powersets/blaster/secondary/devices/cloaking-device';
import { overrides } from '@/data/overrides/powersets/blaster/secondary/devices/cloaking-device';

export const FieldOperative: Power = withOverrides(base, overrides);
