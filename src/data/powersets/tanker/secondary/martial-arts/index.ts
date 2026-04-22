/**
 * Martial Arts Powerset
 * A compilation of various fighting techniques from around the world, Martial Arts makes you a master in the art of hand to hand combat. Martial Artists tend to be very accurate with their strikes.
 *
 * Archetype: tanker
 * Category: secondary
 * Source: tanker_melee/martial_arts
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
import { WarriorsProvocation as WarriorsProvocation } from './warriors-provocation';

export const powerset: Powerset = {
  id: 'tanker/martial-arts',
  name: 'Martial Arts',
  description: 'A compilation of various fighting techniques from around the world, Martial Arts makes you a master in the art of hand to hand combat. Martial Artists tend to be very accurate with their strikes.',
  icon: 'martial_arts_set.ico',
  archetype: 'tanker',
  category: 'secondary',
  powers: [
    CobraStrike,
    CraneKick,
    CripplingAxeKick,
    DragonsTail,
    EaglesClaw,
    FocusChi,
    StormKick,
    ThunderKick,
    WarriorsProvocation,
  ],
};

export default powerset;
