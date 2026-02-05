/**
 * Sonic Attack Powerset
 * Sonic Attack lets you use the power of sound waves to damage and weaken your foes.
 *
 * Archetype: corruptor
 * Category: primary
 * Source: corruptor_ranged/sonic_attack
 */

import type { Powerset } from '@/types';

import { Scream as Scream } from './scream';
import { Shriek as Shriek } from './shriek';
import { Howl as Howl } from './howl';
import { Shockwave as Shockwave } from './shockwave';
import { Shout as Shout } from './shout';
import { Amplify as Amplify } from './amplify';
import { SirensSong as SirensSong } from './sirens-song';
import { Screech as Screech } from './screech';
import { DreadfulWail as DreadfulWail } from './dreadful-wail';

export const powerset: Powerset = {
  id: 'corruptor/sonic-attack',
  name: 'Sonic Attack',
  description: 'Sonic Attack lets you use the power of sound waves to damage and weaken your foes.',
  icon: 'sonic_attack_set.png',
  archetype: 'corruptor',
  category: 'primary',
  powers: [
    Scream,
    Shriek,
    Howl,
    Shockwave,
    Shout,
    Amplify,
    SirensSong,
    Screech,
    DreadfulWail,
  ],
};

export default powerset;
