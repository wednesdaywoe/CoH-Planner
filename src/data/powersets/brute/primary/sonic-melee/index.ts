/**
 * Sonic Melee Powerset
 * Sonic Melee lets you use the power of sound waves to damage your foes with devastating close range sonic attacks that can inflict Migraines, debuffing their resistance to multiple debuffs, and holding foes for a short duration. This can be dramatically increased by using Sound Booster. With the ability to Attune your frequency to your target's, your single target attacks can trigger powerful reverberating damage over time, helping you quickly bring enemies to their knees.
 *
 * Archetype: brute
 * Category: primary
 * Source: brute_melee/sonic_melee
 */

import type { Powerset } from '@/types';

import { SonicThrust as SonicThrust } from './sonic-thrust';
import { StridentEcho as StridentEcho } from './strident-echo';
import { Attune as Attune } from './attune';
import { SoundBooster as SoundBooster } from './sound-booster';
import { SonicClap as SonicClap } from './sonic-clap';
import { Taunt as Taunt } from './taunt';
import { SandmansWhisper as SandmansWhisper } from './sandman-s-whisper';
import { DeafeningWave as DeafeningWave } from './deafening-wave';
import { Earsplitter as Earsplitter } from './earsplitter';

export const powerset: Powerset = {
  id: 'brute/sonic-melee',
  name: 'Sonic Melee',
  description: 'Sonic Melee lets you use the power of sound waves to damage your foes with devastating close range sonic attacks that can inflict Migraines, debuffing their resistance to multiple debuffs, and holding foes for a short duration. This can be dramatically increased by using Sound Booster. With the ability to Attune your frequency to your target\'s, your single target attacks can trigger powerful reverberating damage over time, helping you quickly bring enemies to their knees.',
  icon: 'sonic_manipulation_set.png',
  archetype: 'brute',
  category: 'primary',
  powers: [
    SonicThrust,
    StridentEcho,
    Attune,
    SoundBooster,
    SonicClap,
    Taunt,
    SandmansWhisper,
    DeafeningWave,
    Earsplitter,
  ],
};

export default powerset;
