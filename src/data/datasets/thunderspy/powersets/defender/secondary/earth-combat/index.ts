/**
 * Earth Combat Powerset
 * With Earth Assault, you can damage foes with the very ground they walk upon.  You can conjure stone weapons, hurl boulders, and even cause magma to erupt from the ground.
 *
 * Archetype: defender
 * Category: secondary
 * Source: defender_ranged/earth_assault
 */

import type { Powerset } from '@/types';

import { StoneSpears as StoneSpears } from './stone-spears';
import { StoneMallet as StoneMallet } from './stone-mallet';
import { Fissure as Fissure } from './fissure';
import { HurlBoulder as HurlBoulder } from './hurl-boulder';
import { PowerBoost as PowerBoost } from './power-boost';
import { HeavyMallet as HeavyMallet } from './heavy-mallet';
import { Tremor as Tremor } from './tremor';
import { MudPots as MudPots } from './mud-pots';
import { SeismicSmash as SeismicSmash } from './seismic-smash';

export const powerset: Powerset = {
  id: 'defender/earth-combat',
  internalName: 'earth_assault',
  name: 'Earth Combat',
  description: 'With Earth Assault, you can damage foes with the very ground they walk upon.  You can conjure stone weapons, hurl boulders, and even cause magma to erupt from the ground.',
  icon: 'earth_assault_set.ico',
  archetype: 'defender',
  category: 'secondary',
  powers: [
    StoneSpears,
    StoneMallet,
    Fissure,
    HurlBoulder,
    PowerBoost,
    HeavyMallet,
    Tremor,
    MudPots,
    SeismicSmash,
  ],
};

export default powerset;
