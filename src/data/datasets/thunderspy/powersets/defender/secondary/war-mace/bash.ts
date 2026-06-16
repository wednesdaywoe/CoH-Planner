/**
 * Bash — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs defender_ranged war_mace
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Bash as base } from '@/data/datasets/thunderspy/generated/powersets/defender/secondary/war-mace/bash';
import { overrides } from '@/data/datasets/thunderspy/overrides/powersets/defender/secondary/war-mace/bash';

export const Bash: Power = withOverrides(base, overrides);
