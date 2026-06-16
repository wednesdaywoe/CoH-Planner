/**
 * Umbral Blast Powerset
 * Masters of the void, Warshades can manipulate dark energy, gravity and matter to blast and dominate their foes.  The gravimetric nature of most Umbral Blast powers often slows the targets attack and movement speed.
 *
 * Archetype: warshade
 * Category: epic
 * Source: warshade_offensive/umbral_blast
 */

import type { Powerset } from '@/types';

import { ShadowBolt as ShadowBolt } from './shadow-bolt';
import { EbonEye as EbonEye } from './ebon-eye';
import { GravimetricSnare as GravimetricSnare } from './gravimetric-snare';
import { DarkNova as DarkNova } from './dark-nova';
import { ShadowBlast as ShadowBlast } from './shadow-blast';
import { EssenceDrain as EssenceDrain } from './essence-drain';
import { SunlessMire as SunlessMire } from './sunless-mire';
import { DarkMatterDetonation as DarkMatterDetonation } from './dark-matter-detonation';
import { GravityWell as GravityWell } from './gravity-well';
import { GraviticEmanation as GraviticEmanation } from './gravitic-emanation';
import { UnchainEssence as UnchainEssence } from './unchain-essence';
import { DarkExtraction as DarkExtraction } from './dark-extraction';
import { Quasar as Quasar } from './quasar';

export const powerset: Powerset = {
  id: 'warshade/umbral-blast',
  name: 'Umbral Blast',
  description: 'Masters of the void, Warshades can manipulate dark energy, gravity and matter to blast and dominate their foes.  The gravimetric nature of most Umbral Blast powers often slows the targets attack and movement speed.',
  icon: 'umbral_blast_set.ico',
  archetype: 'warshade',
  category: 'epic',
  powers: [
    ShadowBolt,
    EbonEye,
    GravimetricSnare,
    DarkNova,
    ShadowBlast,
    EssenceDrain,
    SunlessMire,
    DarkMatterDetonation,
    GravityWell,
    GraviticEmanation,
    UnchainEssence,
    DarkExtraction,
    Quasar,
  ],
};

export default powerset;
