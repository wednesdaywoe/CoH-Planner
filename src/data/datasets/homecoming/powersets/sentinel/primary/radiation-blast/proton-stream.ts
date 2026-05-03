/**
 * Proton Stream — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs sentinel_ranged radiation_blast
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { ProtonStream as base } from '@/data/datasets/homecoming/generated/powersets/sentinel/primary/radiation-blast/proton-stream';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/sentinel/primary/radiation-blast/proton-stream';

export const ProtonStream: Power = withOverrides(base, overrides);
