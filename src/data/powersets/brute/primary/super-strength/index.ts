/**
 * Super Strength Powerset
 * Super Strength gives you combat powers derived from your super-human physical strength. Super Strength powers tend to knock foes back.
 *
 * Archetype: brute
 * Category: primary
 * Source: brute_melee/super_strength
 */

import type { Powerset } from '@/types';

import { Jab as Jab } from './jab';
import { Punch as Punch } from './punch';
import { Haymaker as Haymaker } from './haymaker';
import { HandClap as HandClap } from './hand-clap';
import { KnockoutBlow as KnockoutBlow } from './knockout-blow';
import { Taunt as Taunt } from './taunt';
import { Rage as Rage } from './rage';
import { Hurl as Hurl } from './hurl';
import { FootStomp as FootStomp } from './foot-stomp';

export const powerset: Powerset = {
  id: 'brute/super-strength',
  name: 'Super Strength',
  description: 'Super Strength gives you combat powers derived from your super-human physical strength. Super Strength powers tend to knock foes back.',
  icon: 'super_strength_set.png',
  archetype: 'brute',
  category: 'primary',
  powers: [
    Jab,
    Punch,
    Haymaker,
    HandClap,
    KnockoutBlow,
    Taunt,
    Rage,
    Hurl,
    FootStomp,
  ],
};

export default powerset;
