/**
 * Martial Arts Powerset
 * A compilation of various fighting techniques from around the world, Martial Arts makes you a master in the art of hand to hand combat. Martial Artists tend to be very accurate with their strikes.
 *
 * Archetype: brute
 * Category: primary
 * Source: brute_melee/martial_arts
 */

import type { Powerset } from '@/types';

import { ThunderKick as ThunderKick } from './thunder-kick';
import { StormKick as StormKick } from './storm-kick';
import { CobraStrike as CobraStrike } from './cobra-strike';
import { FocusChi as FocusChi } from './focus-chi';
import { CraneKick as CraneKick } from './crane-kick';
import { WarriorsProvocation as WarriorsProvocation } from './warriors-provocation';
import { CripplingAxeKick as CripplingAxeKick } from './crippling-axe-kick';
import { DragonsTail as DragonsTail } from './dragons-tail';
import { EaglesClaw as EaglesClaw } from './eagles-claw';

export const powerset: Powerset = {
  id: 'brute/martial-arts',
  setPath: 'Brute_Melee.Martial_Arts',
  name: 'Martial Arts',
  buyRequires: [],
  buyRequiresFailed: "",
  specializeAt: 0,
  specializeRequires: [],
  description: 'A compilation of various fighting techniques from around the world, Martial Arts makes you a master in the art of hand to hand combat. Martial Artists tend to be very accurate with their strikes.',
  icon: 'martial_arts_set.ico',
  archetype: 'brute',
  category: 'primary',
  powers: [
    ThunderKick,
    StormKick,
    CobraStrike,
    FocusChi,
    CraneKick,
    WarriorsProvocation,
    CripplingAxeKick,
    DragonsTail,
    EaglesClaw,
  ],
};

export default powerset;
