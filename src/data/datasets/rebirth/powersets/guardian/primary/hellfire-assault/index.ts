/**
 * Hellfire Assault Powerset
 * Your powers are conjured from the depths of the netherworld and beyond.  You wield demonic hellfires that serve as your tools of destruction.  You are capable of manifesting infernal powers that act as long extensions of hellfire.  These powers can tear down even the toughest foes.
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
import { WrathOfHell as WrathOfHell } from './wrath-of-hell';

export const powerset: Powerset = {
  id: 'guardian/hellfire-assault',
  internalName: 'hellfire_assault',
  name: 'Hellfire Assault',
  description: 'Your powers are conjured from the depths of the netherworld and beyond.  You wield demonic hellfires that serve as your tools of destruction.  You are capable of manifesting infernal powers that act as long extensions of hellfire.  These powers can tear down even the toughest foes.',
  icon: 'demon_summoning_set.ico',
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
    WrathOfHell,
  ],
};

export default powerset;
