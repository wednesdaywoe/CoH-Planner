/**
 * Kinetic Melee Powerset
 * Kinetic Melee features a mix of fast light attacks and slow heavy attacks, including some with range. All attacks in this set except Assassin's Strike reduce the damage strength of enemies who are hit.
 *
 * Archetype: stalker
 * Category: primary
 * Source: stalker_melee/kinetic_attack
 */

import type { Powerset } from '@/types';

import { BodyBlow as BodyBlow } from './body-blow';
import { QuickStrike as QuickStrike } from './quick-strike';
import { SmashingBlow as SmashingBlow } from './smashing-blow';
import { AssassinsStrike as AssassinsStrike } from './assassin-s-strike';
import { BuildUp as BuildUp } from './build-up';
import { Placate as Placate } from './placate';
import { Burst as Burst } from './burst';
import { FocusedBurst as FocusedBurst } from './focused-burst';
import { ConcentratedStrike as ConcentratedStrike } from './concentrated-strike';

export const powerset: Powerset = {
  id: 'stalker/kinetic-melee',
  name: 'Kinetic Melee',
  description: 'Kinetic Melee features a mix of fast light attacks and slow heavy attacks, including some with range. All attacks in this set except Assassin\'s Strike reduce the damage strength of enemies who are hit.',
  icon: 'kinetic_attack_set.png',
  archetype: 'stalker',
  category: 'primary',
  powers: [
    BodyBlow,
    QuickStrike,
    SmashingBlow,
    AssassinsStrike,
    BuildUp,
    Placate,
    Burst,
    FocusedBurst,
    ConcentratedStrike,
  ],
};

export default powerset;
