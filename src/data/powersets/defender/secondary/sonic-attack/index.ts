/**
 * Sonic Attack Powerset
 * Sonic Attack lets you use the power of sound waves to damage and weaken your foes.
 *
 * Archetype: defender
 * Category: secondary
 * Source: defender_ranged/sonic_attack
 */

import type { Powerset } from '@/types';

import { Amplify as Amplify } from './amplify';
import { DreadfulWail as DreadfulWail } from './dreadful-wail';
import { Howl as Howl } from './howl';
import { Scream as Scream } from './scream';
import { Screech as Screech } from './screech';
import { Shockwave as Shockwave } from './shockwave';
import { Shout as Shout } from './shout';
import { Shriek as Shriek } from './shriek';
import { SirensSong as SirensSong } from './sirens-song';

export const powerset: Powerset = {
  id: 'defender/sonic-attack',
  name: 'Sonic Attack',
  description: 'Sonic Attack lets you use the power of sound waves to damage and weaken your foes.',
  icon: 'sonic_attack_set.ico',
  archetype: 'defender',
  category: 'secondary',
  powers: [
    Amplify,
    DreadfulWail,
    Howl,
    Scream,
    Screech,
    Shockwave,
    Shout,
    Shriek,
    SirensSong,
  ],
};

export default powerset;
