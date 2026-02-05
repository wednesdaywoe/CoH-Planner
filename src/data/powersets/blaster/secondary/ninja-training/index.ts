/**
 * Ninja Training Powerset
 * You compliment your abilities with training in the secret art of the Ninja. You have mastered valuable ninja tools, poisons and weapons, including the deadly Ninja Blade. You also mastered the harmonic powers of Kuji-In Toh, allowing you to regenerate and recover endurance at an accelerated rate.
 *
 * Archetype: blaster
 * Category: secondary
 * Source: blaster_support/ninja_training
 */

import type { Powerset } from '@/types';

import { ImmobilizingDart as ImmobilizingDart } from './immobilizing-dart';
import { StingoftheWasp as StingoftheWasp } from './sting-of-the-wasp';
import { ChokingPowder as ChokingPowder } from './choking-powder';
import { Shinobi as Shinobi } from './shinobi';
import { TheLotusDrops as TheLotusDrops } from './the-lotus-drops';
import { KujiInToh as KujiInToh } from './kuji-in-toh';
import { SmokeFlash as SmokeFlash } from './smoke-flash';
import { BlindingPowder as BlindingPowder } from './blinding-powder';
import { GoldenDragonfly as GoldenDragonfly } from './golden-dragonfly';

export const powerset: Powerset = {
  id: 'blaster/ninja-training',
  name: 'Ninja Training',
  description: 'You compliment your abilities with training in the secret art of the Ninja. You have mastered valuable ninja tools, poisons and weapons, including the deadly Ninja Blade. You also mastered the harmonic powers of Kuji-In Toh, allowing you to regenerate and recover endurance at an accelerated rate.',
  icon: 'ninja_training_set.png',
  archetype: 'blaster',
  category: 'secondary',
  powers: [
    ImmobilizingDart,
    StingoftheWasp,
    ChokingPowder,
    Shinobi,
    TheLotusDrops,
    KujiInToh,
    SmokeFlash,
    BlindingPowder,
    GoldenDragonfly,
  ],
};

export default powerset;
