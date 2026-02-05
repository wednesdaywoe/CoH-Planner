/**
 * Sonic Manipulation Powerset
 * You have the ability to control sound in several fashions. You can create semi-solid barriers, set up waves which weaken or strengthen a target, as well as inflicing devastating close range sonic attacks that can cause Migraines that hold foes for a short hold. This chance can be dramatically increased by using Sound Booster.
 *
 * Archetype: blaster
 * Category: secondary
 * Source: blaster_support/sonic_manipulation
 */

import type { Powerset } from '@/types';

import { SonicThrust as SonicThrust } from './sonic-thrust';
import { StridentEcho as StridentEcho } from './strident-echo';
import { EchoChamber as EchoChamber } from './echo-chamber';
import { SoundBooster as SoundBooster } from './sound-booster';
import { DeafeningWave as DeafeningWave } from './deafening-wave';
import { SoundBarrier as SoundBarrier } from './sound-barrier';
import { DisruptionAura as DisruptionAura } from './disruption-aura';
import { SoundCannon as SoundCannon } from './sound-cannon';
import { Earsplitter as Earsplitter } from './earsplitter';

export const powerset: Powerset = {
  id: 'blaster/sonic-manipulation',
  name: 'Sonic Manipulation',
  description: 'You have the ability to control sound in several fashions. You can create semi-solid barriers, set up waves which weaken or strengthen a target, as well as inflicing devastating close range sonic attacks that can cause Migraines that hold foes for a short hold. This chance can be dramatically increased by using Sound Booster.',
  icon: 'sonic_manipulation_set.png',
  archetype: 'blaster',
  category: 'secondary',
  powers: [
    SonicThrust,
    StridentEcho,
    EchoChamber,
    SoundBooster,
    DeafeningWave,
    SoundBarrier,
    DisruptionAura,
    SoundCannon,
    Earsplitter,
  ],
};

export default powerset;
