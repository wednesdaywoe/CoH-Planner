/**
 * Sonic Manipulation Powerset
 * You have the ability to control sound in several fashions. You can create semi-solid barriers, set up waves which weaken or strengthen a target, as well as inflicing devastating close range sonic attacks that can cause Migraines that hold foes for a short hold. This chance can be dramatically increased by using Sound Booster.
 *
 * Archetype: blaster
 * Category: secondary
 * Source: blaster_support/sonic_manipulation
 */

import type { Powerset } from '@/types';

import { SoundBooster as SoundBooster } from './build-up';
import { DeafeningWave as DeafeningWave } from './deafening-wave';
import { DisruptionAura as DisruptionAura } from './disruption-aura';
import { Earsplitter as Earsplitter } from './earsplitter';
import { EchoChamber as EchoChamber } from './echo-chamber';
import { SonicThrust as SonicThrust } from './sonic-thrust';
import { SoundBarrier as SoundBarrier } from './sound-barrier';
import { SoundCannon as SoundCannon } from './sound-cannon';
import { StridentEcho as StridentEcho } from './strident-echo';

export const powerset: Powerset = {
  id: 'blaster/sonic-manipulation',
  name: 'Sonic Manipulation',
  description: 'You have the ability to control sound in several fashions. You can create semi-solid barriers, set up waves which weaken or strengthen a target, as well as inflicing devastating close range sonic attacks that can cause Migraines that hold foes for a short hold. This chance can be dramatically increased by using Sound Booster.',
  icon: 'sonic_manipulation_set.ico',
  archetype: 'blaster',
  category: 'secondary',
  powers: [
    SoundBooster,
    DeafeningWave,
    DisruptionAura,
    Earsplitter,
    EchoChamber,
    SonicThrust,
    SoundBarrier,
    SoundCannon,
    StridentEcho,
  ],
};

export default powerset;
