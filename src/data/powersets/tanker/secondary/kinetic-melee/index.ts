/**
 * Kinetic Melee Powerset
 * Kinetic Melee features a mix of fast light attacks and slow heavy attacks, including some with range. All attacks in this set reduce the damage strength of enemies who are hit.
 *
 * Archetype: tanker
 * Category: secondary
 * Source: tanker_melee/kinetic_attack
 */

import type { Powerset } from '@/types';

import { BodyBlow as BodyBlow } from './body-blow';
import { Burst as Burst } from './burst';
import { FocusedBurst as FocusedBurst } from './focused-burst';
import { PowerSiphon as PowerSiphon } from './power-siphon';
import { QuickStrike as QuickStrike } from './quick-strike';
import { RepulsingTorrent as RepulsingTorrent } from './repulsing-torrent';
import { SmashingBlow as SmashingBlow } from './smashing-blow';
import { Taunt as Taunt } from './taunt';
import { ConcentratedStrike as ConcentratedStrike } from './total-focus';

export const powerset: Powerset = {
  id: 'tanker/kinetic-melee',
  name: 'Kinetic Melee',
  description: 'Kinetic Melee features a mix of fast light attacks and slow heavy attacks, including some with range. All attacks in this set reduce the damage strength of enemies who are hit.',
  icon: 'kinetic_attack_set.ico',
  archetype: 'tanker',
  category: 'secondary',
  powers: [
    BodyBlow,
    Burst,
    FocusedBurst,
    PowerSiphon,
    QuickStrike,
    RepulsingTorrent,
    SmashingBlow,
    Taunt,
    ConcentratedStrike,
  ],
};

export default powerset;
