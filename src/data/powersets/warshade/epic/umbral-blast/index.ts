/**
 * Umbral Blast Powerset
 * Masters of the void, Warshades can manipulate dark energy, gravity and matter to blast and dominate their foes. The gravimetric nature of most Umbral Blast powers often slows the targets attack and movement speed.
 *
 * Archetype: warshade
 * Category: Epic
 */

import type { Powerset } from '@/types';

import { ShadowBolt } from './shadow-bolt';
import { EbonEye } from './ebon-eye';
import { GravimetricSnare } from './gravimetric-snare';
import { DarkNova } from './dark-nova';
import { DarkNovaBolt } from './dark-nova-bolt';
import { DarkNovaBlast } from './dark-nova-blast';
import { DarkNovaEmanation } from './dark-nova-emanation';
import { DarkNovaDetonation } from './dark-nova-detonation';
import { ShadowBlast } from './shadow-blast';
import { StarlessStep } from './starless-step';
import { SunlessMire } from './sunless-mire';
import { DarkDetonation } from './dark-detonation';
import { GravityWell } from './gravity-well';
import { EssenceDrain } from './essence-drain';
import { GraviticEmanation } from './gravitic-emanation';
import { UnchainEssence } from './unchain-essence';
import { DarkExtraction } from './dark-extraction';
import { Quasar } from './quasar';

export const powerset: Powerset = {
  id: 'warshade/umbral-blast',
  name: 'Umbral Blast',
  description: 'Masters of the void, Warshades can manipulate dark energy, gravity and matter to blast and dominate their foes. The gravimetric nature of most Umbral Blast powers often slows the targets attack and movement speed.',
  icon: 'umbral_blast_set.png',
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
    ShadowBlast,
    StarlessStep,
    SunlessMire,
    DarkDetonation,
    GravityWell,
    EssenceDrain,
    GraviticEmanation,
    UnchainEssence,
    DarkExtraction,
    Quasar,
  ],
};

export default powerset;
