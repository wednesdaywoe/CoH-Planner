/**
 * Executioner's Shot — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs blaster_ranged dual_pistols
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { ExecutionersShot as base } from '@/data/generated/powersets/blaster/primary/dual-pistols/executioners-shot';
import { overrides } from '@/data/overrides/powersets/blaster/primary/dual-pistols/executioners-shot';

export const ExecutionersShot: Power = withOverrides(base, overrides);
