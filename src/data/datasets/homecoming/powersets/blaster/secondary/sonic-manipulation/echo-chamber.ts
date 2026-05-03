/**
 * Echo Chamber — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs blaster_support sonic_manipulation
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { EchoChamber as base } from '@/data/generated/powersets/blaster/secondary/sonic-manipulation/echo-chamber';
import { overrides } from '@/data/overrides/powersets/blaster/secondary/sonic-manipulation/echo-chamber';

export const EchoChamber: Power = withOverrides(base, overrides);
