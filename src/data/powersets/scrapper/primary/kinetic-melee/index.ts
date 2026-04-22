/**
 * Kinetic Melee Powerset
 * Kinetic Melee features a mix of fast light attacks and slow heavy attacks, including some with range. All attacks in this set reduce the damage strength of enemies who are hit.
 *
 * Archetype: scrapper
 * Category: primary
 * Source: scrapper_melee/kinetic_attack
 */

import type { Powerset } from '@/types';

import { BodyBlow as BodyBlow } from './body-blow';
import { Burst as Burst } from './burst';
import { Confront as Confront } from './confront';
import { FocusedBurst as FocusedBurst } from './focused-burst';
import { PowerSiphon as PowerSiphon } from './power-siphon';
import { QuickStrike as QuickStrike } from './quick-strike';
import { RepulsingTorrent as RepulsingTorrent } from './repulsing-torrent';
import { SmashingBlow as SmashingBlow } from './smashing-blow';
import { ConcentratedStrike as ConcentratedStrike } from './total-focus';

export const powerset: Powerset = {
  id: 'scrapper/kinetic-melee',
  name: 'Kinetic Melee',
  description: 'Kinetic Melee features a mix of fast light attacks and slow heavy attacks, including some with range. All attacks in this set reduce the damage strength of enemies who are hit.',
  icon: 'kinetic_attack_set.ico',
  archetype: 'scrapper',
  category: 'primary',
  powers: [
    BodyBlow,
    Burst,
    Confront,
    FocusedBurst,
    PowerSiphon,
    QuickStrike,
    RepulsingTorrent,
    SmashingBlow,
    ConcentratedStrike,
  ],
};

export default powerset;
