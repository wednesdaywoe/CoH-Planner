/**
 * Proton Volley — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs corruptor_ranged radiation_blast
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { ProtonVolley as base } from '@/data/generated/powersets/corruptor/primary/radiation-blast/proton-volley';
import { overrides } from '@/data/overrides/powersets/corruptor/primary/radiation-blast/proton-volley';

export const ProtonVolley: Power = withOverrides(base, overrides);
