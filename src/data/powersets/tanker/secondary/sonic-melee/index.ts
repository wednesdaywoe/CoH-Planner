/**
 * Sonic Melee Powerset
 * Sonic Melee lets you use the power of sound waves to damage your foes with devastating close range sonic attacks that can inflict Migraines, debuffing their resistance to multiple debuffs, and holding foes for a short duration. This can be dramatically increased by using Sound Booster. With the ability to Attune your frequency to your target's, your single target attacks can trigger powerful reverberating damage over time, helping you quickly bring enemies to their knees.
 *
 * Archetype: tanker
 * Category: secondary
 * Source: tanker_melee/sonic_melee
 */

import type { Powerset } from '@/types';

import { SonicThrust as SonicThrust } from './sonic-thrust';
import { StridentEcho as StridentEcho } from './strident-echo';
import { Attune as Attune } from './attune';
import { Taunt as Taunt } from './taunt';
import { SonicClap as SonicClap } from './sonic-clap';
import { SoundBooster as SoundBooster } from './sound-booster';
import { SandmansWhisper as SandmansWhisper } from './sandman-s-whisper';
import { DeafeningWave as DeafeningWave } from './deafening-wave';
import { Earsplitter as Earsplitter } from './earsplitter';

export const powerset: Powerset = {
  id: 'tanker/sonic-melee',
  name: 'Sonic Melee',
  description: 'Sonic Melee lets you use the power of sound waves to damage your foes with devastating close range sonic attacks that can inflict Migraines, debuffing their resistance to multiple debuffs, and holding foes for a short duration. This can be dramatically increased by using Sound Booster. With the ability to Attune your frequency to your target\'s, your single target attacks can trigger powerful reverberating damage over time, helping you quickly bring enemies to their knees.',
  icon: 'sonic_manipulation_set.png',
  archetype: 'tanker',
  category: 'secondary',
  powers: [
    SonicThrust,
    StridentEcho,
    Attune,
    Taunt,
    SonicClap,
    SoundBooster,
    SandmansWhisper,
    DeafeningWave,
    Earsplitter,
  ],
};

export default powerset;
