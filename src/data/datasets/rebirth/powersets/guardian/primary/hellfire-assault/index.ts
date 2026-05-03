/**
 * Hellfire_Assault Powerset
 * undefined
 *
 * Archetype: guardian
 * Category: primary
 * Source: guardian_assault/hellfire_assault
 */

import type { Powerset } from '@/types';

import { HellfireFlares as HellfireFlares } from './hellfire-flares';
import { HellfireSmash as HellfireSmash } from './hellfire-smash';
import { CrackWhip as CrackWhip } from './crack-whip';
import { Corruption as Corruption } from './corruption';
import { SoulSearing as SoulSearing } from './soul-searing';
import { HellfireBurst as HellfireBurst } from './hellfire-burst';
import { Lash as Lash } from './lash';
import { HellfireBlaze as HellfireBlaze } from './hellfire-blaze';
import { WrathofHell as WrathofHell } from './wrath-of-hell';

export const powerset: Powerset = {
  id: 'guardian/hellfire-assault',
  name: 'Hellfire_Assault',
  description: 'undefined',
  icon: '',
  archetype: 'guardian',
  category: 'primary',
  powers: [
    HellfireFlares,
    HellfireSmash,
    CrackWhip,
    Corruption,
    SoulSearing,
    HellfireBurst,
    Lash,
    HellfireBlaze,
    WrathofHell,
  ],
};

export default powerset;
