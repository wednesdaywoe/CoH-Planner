/**
 * Storm Summoning Powerset
 * You can command the forces of nature! Storm Summoning allows you to control wind and weather to aid your allies and wreak havoc on your foes.
 *
 * Archetype: corruptor
 * Category: secondary
 * Source: corruptor_buff/storm_summoning
 */

import type { Powerset } from '@/types';

import { FreezingRain as FreezingRain } from './freezing-rain';
import { Gale as Gale } from './gale';
import { Hurricane as Hurricane } from './hurricane';
import { LightningStorm as LightningStorm } from './lightning-storm';
import { O2Boost as O2Boost } from './o2-boost';
import { SnowStorm as SnowStorm } from './snow-storm';
import { SteamyMist as SteamyMist } from './steamy-mist';
import { ThunderClap as ThunderClap } from './thunder-clap';
import { Tornado as Tornado } from './tornado';

export const powerset: Powerset = {
  id: 'corruptor/storm-summoning',
  name: 'Storm Summoning',
  description: 'You can command the forces of nature! Storm Summoning allows you to control wind and weather to aid your allies and wreak havoc on your foes.',
  icon: 'storm_summoning_set.ico',
  archetype: 'corruptor',
  category: 'secondary',
  powers: [
    FreezingRain,
    Gale,
    Hurricane,
    LightningStorm,
    O2Boost,
    SnowStorm,
    SteamyMist,
    ThunderClap,
    Tornado,
  ],
};

export default powerset;
