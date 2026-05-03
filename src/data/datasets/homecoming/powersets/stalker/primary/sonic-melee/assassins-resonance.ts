/**
 * Assassin's Whisper — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs stalker_melee sonic_melee
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { AssassinsWhisper as base } from '@/data/datasets/homecoming/generated/powersets/stalker/primary/sonic-melee/assassins-resonance';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/stalker/primary/sonic-melee/assassins-resonance';

export const AssassinsWhisper: Power = withOverrides(base, overrides);
