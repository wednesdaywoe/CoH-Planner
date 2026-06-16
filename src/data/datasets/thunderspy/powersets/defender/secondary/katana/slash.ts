/**
 * Gambler's Cut — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs defender_ranged katana
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Slash as base } from '@/data/datasets/thunderspy/generated/powersets/defender/secondary/katana/slash';
import { overrides } from '@/data/datasets/thunderspy/overrides/powersets/defender/secondary/katana/slash';

export const Slash: Power = withOverrides(base, overrides);
