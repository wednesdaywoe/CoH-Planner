/**
 * Umbral Blast Powerset
 * Masters of the void, Warshades can manipulate dark energy, gravity and matter to blast and dominate their foes. The gravimetric nature of most Umbral Blast powers often slows the targets attack and movement speed.
 *
 * Archetype: warshade
 * Category: epic
 * Source: warshade_offensive/umbral_blast
 */

import type { Powerset } from '@/types';

import { DarkExtraction as DarkExtraction } from './dark-extraction';
import { DarkDetonation as DarkDetonation } from './dark-matter-detonation';
import { DarkNova as DarkNova } from './dark-nova';
import { DarkNovaBlast as DarkNovaBlast } from './dark-nova-blast';
import { DarkNovaBolt as DarkNovaBolt } from './dark-nova-bolt';
import { DarkNovaDetonation as DarkNovaDetonation } from './dark-nova-detonation';
import { DarkNovaEmanation as DarkNovaEmanation } from './dark-nova-emanation';
import { EbonEye as EbonEye } from './ebon-eye';
import { EssenceDrain as EssenceDrain } from './essence-drain';
import { GravimetricSnare as GravimetricSnare } from './gravimetric-snare';
import { GraviticEmanation as GraviticEmanation } from './gravitic-emanation';
import { GravityWell as GravityWell } from './gravity-well';
import { Quasar as Quasar } from './quasar';
import { ShadowBlast as ShadowBlast } from './shadow-blast';
import { ShadowBolt as ShadowBolt } from './shadow-bolt';
import { StarlessStep as StarlessStep } from './starless-step';
import { SunlessMire as SunlessMire } from './sunless-mire';
import { UnchainEssence as UnchainEssence } from './unchain-essence';

export const powerset: Powerset = {
  id: 'warshade/umbral-blast',
  name: 'Umbral Blast',
  description: 'Masters of the void, Warshades can manipulate dark energy, gravity and matter to blast and dominate their foes. The gravimetric nature of most Umbral Blast powers often slows the targets attack and movement speed.',
  icon: 'umbral_blast_set.ico',
  archetype: 'warshade',
  category: 'epic',
  powers: [
    DarkExtraction,
    DarkDetonation,
    DarkNova,
    DarkNovaBlast,
    DarkNovaBolt,
    DarkNovaDetonation,
    DarkNovaEmanation,
    EbonEye,
    EssenceDrain,
    GravimetricSnare,
    GraviticEmanation,
    GravityWell,
    Quasar,
    ShadowBlast,
    ShadowBolt,
    StarlessStep,
    SunlessMire,
    UnchainEssence,
  ],
};

export default powerset;
