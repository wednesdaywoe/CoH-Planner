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
import { DarkNovaBolt as DarkNovaBolt } from './dark-nova-bolt';
import { DarkNovaBlast as DarkNovaBlast } from './dark-nova-blast';
import { DarkNovaEmanation as DarkNovaEmanation } from './dark-nova-emanation';
import { DarkNovaDetonation as DarkNovaDetonation } from './dark-nova-detonation';
import { DarkDetonation as DarkDetonation } from './dark-matter-detonation';
import { ShadowBlast as ShadowBlast } from './shadow-blast';
import { GraviticEmanation as GraviticEmanation } from './gravitic-emanation';
import { ExtinguishLight as ExtinguishLight } from './starless-step';
import { GravityWell as GravityWell } from './gravity-well';
import { EssenceDrain as EssenceDrain } from './essence-drain';
import { SunlessMire as SunlessMire } from './sunless-mire';
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
    DarkNovaBolt,
    DarkNovaBlast,
    DarkNovaEmanation,
    DarkNovaDetonation,
    DarkDetonation,
    ShadowBlast,
    GraviticEmanation,
    ExtinguishLight,
    GravityWell,
    EssenceDrain,
    SunlessMire,
    UnchainEssence,
    DarkExtraction,
    Quasar,
  ],
};

export default powerset;
