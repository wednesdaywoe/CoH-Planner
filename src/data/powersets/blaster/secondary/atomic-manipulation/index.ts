/**
 * Atomic Manipulation Powerset
 * You have complete control over atomic particles and waves, and can use them to disable and weaken your enemies, as well as boost your own power. Many of your powers have the ability to surround your targets with negatrons or positrons. Should you combine both of these in a single target, it will result in Electron-Positron annihilation producing a burst of Gamma Rays which will inflict a small amount of damage, and in addition debuff the target's damage output and accuracy. Enemies also have a small chance of being stunned or confused.
 *
 * Archetype: blaster
 * Category: secondary
 * Source: blaster_support/radiation_manipulation
 */

import type { Powerset } from '@/types';

import { ElectronShackles as ElectronShackles } from './electron-shackles';
import { NegatronSlam as NegatronSlam } from './negatron-slam';
import { PositronCell as PositronCell } from './positron-cell';
import { Ionize as Ionize } from './ionize';
import { BetaDecay as BetaDecay } from './beta-decay';
import { MetabolicAcceleration as MetabolicAcceleration } from './metabolic-acceleration';
import { AtomSmasher as AtomSmasher } from './atom-smasher';
import { RadioactiveCloud as RadioactiveCloud } from './radioactive-cloud';
import { PositronicFist as PositronicFist } from './positronic-fist';

export const powerset: Powerset = {
  id: 'blaster/atomic-manipulation',
  name: 'Atomic Manipulation',
  description: 'You have complete control over atomic particles and waves, and can use them to disable and weaken your enemies, as well as boost your own power. Many of your powers have the ability to surround your targets with negatrons or positrons. Should you combine both of these in a single target, it will result in Electron-Positron annihilation producing a burst of Gamma Rays which will inflict a small amount of damage, and in addition debuff the target\'s damage output and accuracy. Enemies also have a small chance of being stunned or confused.',
  icon: 'radiation_manipulation_set.png',
  archetype: 'blaster',
  category: 'secondary',
  powers: [
    ElectronShackles,
    NegatronSlam,
    PositronCell,
    Ionize,
    BetaDecay,
    MetabolicAcceleration,
    AtomSmasher,
    RadioactiveCloud,
    PositronicFist,
  ],
};

export default powerset;
