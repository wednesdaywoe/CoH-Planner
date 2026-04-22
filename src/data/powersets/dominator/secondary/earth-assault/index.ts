/**
 * Earth Assault Powerset
 * With Earth Assault, you can damage foes with the very ground they walk upon. You can conjure stone weapons, hurl boulders, and even cause magma to erupt from the ground.
 *
 * Archetype: dominator
 * Category: secondary
 * Source: dominator_assault/earth_assault
 */

import type { Powerset } from '@/types';

import { Fissure as Fissure } from './fissure';
import { HeavyMallet as HeavyMallet } from './heavy-mallet';
import { HurlBoulder as HurlBoulder } from './hurl-boulder';
import { MudPots as MudPots } from './mud-pots';
import { PowerUp as PowerUp } from './power-boost';
import { SeismicSmash as SeismicSmash } from './seismic-smash';
import { StoneMallet as StoneMallet } from './stone-mallet';
import { StoneSpears as StoneSpears } from './stone-spears';
import { Tremor as Tremor } from './tremor';

export const powerset: Powerset = {
  id: 'dominator/earth-assault',
  name: 'Earth Assault',
  description: 'With Earth Assault, you can damage foes with the very ground they walk upon. You can conjure stone weapons, hurl boulders, and even cause magma to erupt from the ground.',
  icon: 'earth_assault_set.ico',
  archetype: 'dominator',
  category: 'secondary',
  powers: [
    Fissure,
    HeavyMallet,
    HurlBoulder,
    MudPots,
    PowerUp,
    SeismicSmash,
    StoneMallet,
    StoneSpears,
    Tremor,
  ],
};

export default powerset;
