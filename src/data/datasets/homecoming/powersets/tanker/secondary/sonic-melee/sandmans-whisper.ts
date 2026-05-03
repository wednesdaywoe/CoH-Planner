/**
 * Sandman's Whisper — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs tanker_melee sonic_melee
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { SandmansWhisper as base } from '@/data/datasets/homecoming/generated/powersets/tanker/secondary/sonic-melee/sandmans-whisper';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/tanker/secondary/sonic-melee/sandmans-whisper';

export const SandmansWhisper: Power = withOverrides(base, overrides);
