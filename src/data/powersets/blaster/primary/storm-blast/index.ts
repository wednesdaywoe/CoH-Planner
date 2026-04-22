/**
 * Storm Blast Powerset
 * Storm Blast conjures violent weather to attack your foes. The use of your storm attacks will empower your created storm cells.
 *
 * Archetype: blaster
 * Category: primary
 * Source: blaster_ranged/storm_blast
 */

import type { Powerset } from '@/types';

import { Intensify as Intensify } from './aim';
import { CategoryFive as CategoryFive } from './category-five';
import { ChainLightning as ChainLightning } from './chain-lightning';
import { Cloudburst as Cloudburst } from './cloudburst';
import { DirectStrike as DirectStrike } from './direct-strike';
import { Gust as Gust } from './gust';
import { Hailstones as Hailstones } from './hailstones';
import { JetStream as JetStream } from './jet-stream';
import { StormCell as StormCell } from './storm-cell';

export const powerset: Powerset = {
  id: 'blaster/storm-blast',
  name: 'Storm Blast',
  description: 'Storm Blast conjures violent weather to attack your foes. The use of your storm attacks will empower your created storm cells.',
  icon: 'storm_summoning_set.ico',
  archetype: 'blaster',
  category: 'primary',
  powers: [
    Intensify,
    CategoryFive,
    ChainLightning,
    Cloudburst,
    DirectStrike,
    Gust,
    Hailstones,
    JetStream,
    StormCell,
  ],
};

export default powerset;
