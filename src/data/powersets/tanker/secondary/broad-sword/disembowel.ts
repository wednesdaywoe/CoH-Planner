/**
 * Disembowel — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs tanker_melee broad_sword
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Disembowel as base } from '@/data/generated/powersets/tanker/secondary/broad-sword/disembowel';
import { overrides } from '@/data/overrides/powersets/tanker/secondary/broad-sword/disembowel';

export const Disembowel: Power = withOverrides(base, overrides);
