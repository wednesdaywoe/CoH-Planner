/**
 * Earth Assault Powerset
 * With Earth Assault, you can damage foes with the very ground they walk upon.  You can conjure stone weapons, hurl boulders, and even cause magma to erupt from the ground.
 *
 * Archetype: guardian
 * Category: primary
 * Source: guardian_assault/earth_assault
 */

import type { Powerset } from '@/types';

import { StoneSpears as StoneSpears } from './stone-spears';
import { StoneFist as StoneFist } from './stone-fist';
import { Fissure as Fissure } from './fissure';
import { StoneMallet as StoneMallet } from './stone-mallet';
import { BuildUp as BuildUp } from './build-up';
import { Tremor as Tremor } from './tremor';
import { HeavyMallet as HeavyMallet } from './heavy-mallet';
import { HurlBoulder as HurlBoulder } from './hurl-boulder';
import { SeismicSmash as SeismicSmash } from './seismic-smash';

export const powerset: Powerset = {
  id: 'guardian/earth-assault',
  name: 'Earth Assault',
  description: 'With Earth Assault, you can damage foes with the very ground they walk upon.  You can conjure stone weapons, hurl boulders, and even cause magma to erupt from the ground.',
  icon: 'earth_assault_set.ico',
  archetype: 'guardian',
  category: 'primary',
  powers: [
    StoneSpears,
    StoneFist,
    Fissure,
    StoneMallet,
    BuildUp,
    Tremor,
    HeavyMallet,
    HurlBoulder,
    SeismicSmash,
  ],
};

export default powerset;
