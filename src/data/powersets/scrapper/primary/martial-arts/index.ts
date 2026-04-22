/**
 * Martial Arts Powerset
 * A compilation of various fighting techniques from around the world, Martial Arts makes you a master in the art of hand to hand combat. Martial Artists tend to be very accurate with their strikes. Like all scrapper powers, all Martial Arts attacks can sometimes land a critical hit for double damage.
 *
 * Archetype: scrapper
 * Category: primary
 * Source: scrapper_melee/martial_arts
 */

import type { Powerset } from '@/types';

import { CobraStrike as CobraStrike } from './cobra-strike';
import { CraneKick as CraneKick } from './crane-kick';
import { CripplingAxeKick as CripplingAxeKick } from './crippling-axe-kick';
import { DragonsTail as DragonsTail } from './dragons-tail';
import { EaglesClaw as EaglesClaw } from './eagles-claw';
import { FocusChi as FocusChi } from './focus-chi';
import { StormKick as StormKick } from './storm-kick';
import { ThunderKick as ThunderKick } from './thunder-kick';
import { WarriorsChallenge as WarriorsChallenge } from './warriors-challenge';

export const powerset: Powerset = {
  id: 'scrapper/martial-arts',
  name: 'Martial Arts',
  description: 'A compilation of various fighting techniques from around the world, Martial Arts makes you a master in the art of hand to hand combat. Martial Artists tend to be very accurate with their strikes. Like all scrapper powers, all Martial Arts attacks can sometimes land a critical hit for double damage.',
  icon: 'martial_arts_set.ico',
  archetype: 'scrapper',
  category: 'primary',
  powers: [
    CobraStrike,
    CraneKick,
    CripplingAxeKick,
    DragonsTail,
    EaglesClaw,
    FocusChi,
    StormKick,
    ThunderKick,
    WarriorsChallenge,
  ],
};

export default powerset;
