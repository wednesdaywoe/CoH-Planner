/**
 * Storm Blast Powerset
 * Storm Blast conjures violent weather to attack your foes. The use of your storm attacks will empower your created storm cells.
 *
 * Archetype: sentinel
 * Category: primary
 * Source: sentinel_ranged/storm_blast
 */

import type { Powerset } from '@/types';

import { Intensify as Intensify } from './aim';
import { CategoryFive as CategoryFive } from './category-five';
import { ChainLightning as ChainLightning } from './chain-lightning';
import { Cloudburst as Cloudburst } from './cloudburst';
import { Gust as Gust } from './gust';
import { Hailstones as Hailstones } from './hailstones';
import { JetStream as JetStream } from './jet-stream';
import { LightningStrike as LightningStrike } from './lightning-strike';
import { StormCell as StormCell } from './storm-cell';

export const powerset: Powerset = {
  id: 'sentinel/storm-blast',
  name: 'Storm Blast',
  description: 'Storm Blast conjures violent weather to attack your foes. The use of your storm attacks will empower your created storm cells.',
  icon: 'storm_summoning_set.ico',
  archetype: 'sentinel',
  category: 'primary',
  powers: [
    Intensify,
    CategoryFive,
    ChainLightning,
    Cloudburst,
    Gust,
    Hailstones,
    JetStream,
    LightningStrike,
    StormCell,
  ],
};

export default powerset;
