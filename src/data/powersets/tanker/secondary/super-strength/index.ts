/**
 * Super Strength Powerset
 * Super Strength gives you combat powers derived from your super-human physical strength. Super Strength powers tend to knock foes back.
 *
 * Archetype: tanker
 * Category: secondary
 * Source: tanker_melee/super_strength
 */

import type { Powerset } from '@/types';

import { FootStomp as FootStomp } from './foot-stomp';
import { HandClap as HandClap } from './hand-clap';
import { Haymaker as Haymaker } from './haymaker';
import { Hurl as Hurl } from './hurl';
import { Jab as Jab } from './jab';
import { KnockoutBlow as KnockoutBlow } from './knockout-blow';
import { Punch as Punch } from './punch';
import { Rage as Rage } from './rage';
import { Taunt as Taunt } from './taunt';

export const powerset: Powerset = {
  id: 'tanker/super-strength',
  name: 'Super Strength',
  description: 'Super Strength gives you combat powers derived from your super-human physical strength. Super Strength powers tend to knock foes back.',
  icon: 'super_strength_set.ico',
  archetype: 'tanker',
  category: 'secondary',
  powers: [
    FootStomp,
    HandClap,
    Haymaker,
    Hurl,
    Jab,
    KnockoutBlow,
    Punch,
    Rage,
    Taunt,
  ],
};

export default powerset;
