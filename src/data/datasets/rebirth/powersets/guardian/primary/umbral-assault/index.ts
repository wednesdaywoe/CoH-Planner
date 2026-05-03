/**
 * Umbral Assault Powerset
 * Masters of the void, Umbral Assault wielders can manipulate dark energy, gravity and matter to blast and dominate their foes.  The gravimetric nature of most Umbral Assault powers often slows the targets attack and movement speed.
 *
 * Archetype: guardian
 * Category: primary
 * Source: guardian_assault/umbral_assault
 */

import type { Powerset } from '@/types';

import { ShadowBolt as ShadowBolt } from './shadow-bolt';
import { UmbralSmite as UmbralSmite } from './umbral-smite';
import { GravimetricSnare as GravimetricSnare } from './gravimetric-snare';
import { EssenceDrain as EssenceDrain } from './essence-drain';
import { InnerUmbra as InnerUmbra } from './inner-umbra';
import { GraviticEmanation as GraviticEmanation } from './gravitic-emanation';
import { ShadowBlast as ShadowBlast } from './shadow-blast';
import { GravityWell as GravityWell } from './gravity-well';
import { DarkExtraction as DarkExtraction } from './dark-extraction';

export const powerset: Powerset = {
  id: 'guardian/umbral-assault',
  name: 'Umbral Assault',
  description: 'Masters of the void, Umbral Assault wielders can manipulate dark energy, gravity and matter to blast and dominate their foes.  The gravimetric nature of most Umbral Assault powers often slows the targets attack and movement speed.',
  icon: 'umbral_blast_set.ico',
  archetype: 'guardian',
  category: 'primary',
  powers: [
    ShadowBolt,
    UmbralSmite,
    GravimetricSnare,
    EssenceDrain,
    InnerUmbra,
    GraviticEmanation,
    ShadowBlast,
    GravityWell,
    DarkExtraction,
  ],
};

export default powerset;
