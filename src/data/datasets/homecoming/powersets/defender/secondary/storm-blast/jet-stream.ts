/**
 * Jet Stream — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs defender_ranged storm_blast
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { JetStream as base } from '@/data/datasets/homecoming/generated/powersets/defender/secondary/storm-blast/jet-stream';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/defender/secondary/storm-blast/jet-stream';

export const JetStream: Power = withOverrides(base, overrides);
