/**
 * Quick Recovery — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs brute_defense willpower
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { QuickRecovery as base } from '@/data/generated/powersets/brute/secondary/willpower/quick-recovery';
import { overrides } from '@/data/overrides/powersets/brute/secondary/willpower/quick-recovery';

export const QuickRecovery: Power = withOverrides(base, overrides);
