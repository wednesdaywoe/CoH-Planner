/**
 * Ninja Training Powerset
 * You compliment your abilities with training in the secret art of the Ninja. You have mastered valuable ninja tools, poisons and weapons, including the deadly Ninja Blade. You also mastered the harmonic powers of Kuji-In Toh, allowing you to regenerate and recover endurance at an accelerated rate.
 *
 * Archetype: blaster
 * Category: secondary
 * Source: blaster_support/ninja_training
 */

import type { Powerset } from '@/types';

import { BlindingPowder as BlindingPowder } from './blinding-powder';
import { ChokingPowder as ChokingPowder } from './choking-powder';
import { GoldenDragonfly as GoldenDragonfly } from './golden-dragonfly';
import { ImmobilizingDart as ImmobilizingDart } from './immobilizing-dart';
import { KujiInToh as KujiInToh } from './kuji-in-toh';
import { Shinobi as Shinobi } from './kyokan';
import { SmokeFlash as SmokeFlash } from './smoke-flash';
import { StingoftheWasp as StingoftheWasp } from './sting-of-the-wasp';
import { TheLotusDrops as TheLotusDrops } from './the-lotus-drops';

export const powerset: Powerset = {
  id: 'blaster/ninja-training',
  name: 'Ninja Training',
  description: 'You compliment your abilities with training in the secret art of the Ninja. You have mastered valuable ninja tools, poisons and weapons, including the deadly Ninja Blade. You also mastered the harmonic powers of Kuji-In Toh, allowing you to regenerate and recover endurance at an accelerated rate.',
  icon: 'ninja_training_set.ico',
  archetype: 'blaster',
  category: 'secondary',
  powers: [
    BlindingPowder,
    ChokingPowder,
    GoldenDragonfly,
    ImmobilizingDart,
    KujiInToh,
    Shinobi,
    SmokeFlash,
    StingoftheWasp,
    TheLotusDrops,
  ],
};

export default powerset;
