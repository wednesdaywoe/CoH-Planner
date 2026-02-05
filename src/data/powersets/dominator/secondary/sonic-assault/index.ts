/**
 * Sonic Assault Powerset
 * Sonic Assault lets you use the power of sound waves to damage and weaken your foes.
 *
 * Archetype: dominator
 * Category: secondary
 * Source: dominator_assault/sonic_assault
 */

import type { Powerset } from '@/types';

import { Shriek as Shriek } from './shriek';
import { StridentEcho as StridentEcho } from './strident-echo';
import { Scream as Scream } from './scream';
import { Shockwave as Shockwave } from './shockwave';
import { BassBoost as BassBoost } from './bass-boost';
import { DeafeningWave as DeafeningWave } from './deafening-wave';
import { DisruptionAura as DisruptionAura } from './disruption-aura';
import { Shout as Shout } from './shout';
import { Earsplitter as Earsplitter } from './earsplitter';

export const powerset: Powerset = {
  id: 'dominator/sonic-assault',
  name: 'Sonic Assault',
  description: 'Sonic Assault lets you use the power of sound waves to damage and weaken your foes.',
  icon: 'sonic_attack_set.png',
  archetype: 'dominator',
  category: 'secondary',
  powers: [
    Shriek,
    StridentEcho,
    Scream,
    Shockwave,
    BassBoost,
    DeafeningWave,
    DisruptionAura,
    Shout,
    Earsplitter,
  ],
};

export default powerset;
