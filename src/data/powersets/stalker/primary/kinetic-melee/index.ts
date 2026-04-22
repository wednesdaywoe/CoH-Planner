/**
 * Kinetic Melee Powerset
 * Kinetic Melee features a mix of fast light attacks and slow heavy attacks, including some with range. All attacks in this set except Assassin's Strike reduce the damage strength of enemies who are hit.
 *
 * Archetype: stalker
 * Category: primary
 * Source: stalker_melee/kinetic_attack
 */

import type { Powerset } from '@/types';

import { AssassinsStrike as AssassinsStrike } from './assassins-strike';
import { BodyBlow as BodyBlow } from './body-blow';
import { BuildUp as BuildUp } from './build-up';
import { Burst as Burst } from './burst';
import { FocusedBurst as FocusedBurst } from './focused-burst';
import { Placate as Placate } from './placate';
import { QuickStrike as QuickStrike } from './quick-strike';
import { SmashingBlow as SmashingBlow } from './smashing-blow';
import { ConcentratedStrike as ConcentratedStrike } from './total-focus';

export const powerset: Powerset = {
  id: 'stalker/kinetic-melee',
  name: 'Kinetic Melee',
  description: 'Kinetic Melee features a mix of fast light attacks and slow heavy attacks, including some with range. All attacks in this set except Assassin\'s Strike reduce the damage strength of enemies who are hit.',
  icon: 'kinetic_attack_set.ico',
  archetype: 'stalker',
  category: 'primary',
  powers: [
    AssassinsStrike,
    BodyBlow,
    BuildUp,
    Burst,
    FocusedBurst,
    Placate,
    QuickStrike,
    SmashingBlow,
    ConcentratedStrike,
  ],
};

export default powerset;
