/**
 * Martial Arts Powerset
 * A compilation of various fighting techniques from around the world, Martial Arts makes you a master in the art of hand to hand combat. Martial Artists tend to be very accurate with their strikes. Like all Stalker primary attack powers, Martial Arts attacks can land a Critical Hit for double damage, if you are properly Hidden or if your target is Slept or Held.
 *
 * Archetype: stalker
 * Category: primary
 * Source: stalker_melee/martial_arts
 */

import type { Powerset } from '@/types';

import { StormKick as StormKick } from './storm-kick';
import { ThunderKick as ThunderKick } from './thunder-kick';
import { CripplingAxeKick as CripplingAxeKick } from './crippling-axe-kick';
import { AssassinsBlow as AssassinsBlow } from './assassin-s-blow';
import { FocusChi as FocusChi } from './focus-chi';
import { Placate as Placate } from './placate';
import { CobraStrike as CobraStrike } from './cobra-strike';
import { CraneKick as CraneKick } from './crane-kick';
import { EaglesClaw as EaglesClaw } from './eagles-claw';

export const powerset: Powerset = {
  id: 'stalker/martial-arts',
  name: 'Martial Arts',
  description: 'A compilation of various fighting techniques from around the world, Martial Arts makes you a master in the art of hand to hand combat. Martial Artists tend to be very accurate with their strikes. Like all Stalker primary attack powers, Martial Arts attacks can land a Critical Hit for double damage, if you are properly Hidden or if your target is Slept or Held.',
  icon: 'martial_arts_set.png',
  archetype: 'stalker',
  category: 'primary',
  powers: [
    StormKick,
    ThunderKick,
    CripplingAxeKick,
    AssassinsBlow,
    FocusChi,
    Placate,
    CobraStrike,
    CraneKick,
    EaglesClaw,
  ],
};

export default powerset;
