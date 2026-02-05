/**
 * Storm Blast Powerset
 * Storm Blast conjures violent weather to attack your foes. The use of your storm attacks will empower your created storm cells.
 *
 * Archetype: corruptor
 * Category: primary
 * Source: corruptor_ranged/storm_blast
 */

import type { Powerset } from '@/types';

import { Gust as Gust } from './gust';
import { Hailstones as Hailstones } from './hailstones';
import { JetStream as JetStream } from './jet-stream';
import { StormCell as StormCell } from './storm-cell';
import { Intensify as Intensify } from './intensify';
import { DirectStrike as DirectStrike } from './direct-strike';
import { ChainLightning as ChainLightning } from './chain-lightning';
import { Cloudburst as Cloudburst } from './cloudburst';
import { CategoryFive as CategoryFive } from './category-five';

export const powerset: Powerset = {
  id: 'corruptor/storm-blast',
  name: 'Storm Blast',
  description: 'Storm Blast conjures violent weather to attack your foes. The use of your storm attacks will empower your created storm cells.',
  icon: 'storm_summoning_set.png',
  archetype: 'corruptor',
  category: 'primary',
  powers: [
    Gust,
    Hailstones,
    JetStream,
    StormCell,
    Intensify,
    DirectStrike,
    ChainLightning,
    Cloudburst,
    CategoryFive,
  ],
};

export default powerset;
