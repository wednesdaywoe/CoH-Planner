/**
 * Storm Summoning Powerset
 * You can command the forces of nature! Storm Summoning allows you to control wind and weather to aid your allies and wreak havoc on your foes.
 *
 * Archetype: controller
 * Category: secondary
 * Source: controller_buff/storm_summoning
 */

import type { Powerset } from '@/types';

import { Gale as Gale } from './gale';
import { O2Boost as O2Boost } from './o2-boost';
import { SnowStorm as SnowStorm } from './snow-storm';
import { SteamyMist as SteamyMist } from './steamy-mist';
import { Fog as Fog } from './fog';
import { Hurricane as Hurricane } from './hurricane';
import { ThunderClap as ThunderClap } from './thunder-clap';
import { Tornado as Tornado } from './tornado';
import { LightningStorm as LightningStorm } from './lightning-storm';

export const powerset: Powerset = {
  id: 'controller/storm-summoning',
  setPath: 'Controller_Buff.Storm_Summoning',
  name: 'Storm Summoning',
  buyRequires: [],
  buyRequiresFailed: "",
  specializeAt: 0,
  specializeRequires: [],
  description: 'You can command the forces of nature! Storm Summoning allows you to control wind and weather to aid your allies and wreak havoc on your foes.',
  icon: 'storm_summoning_set.ico',
  archetype: 'controller',
  category: 'secondary',
  powers: [
    Gale,
    O2Boost,
    SnowStorm,
    SteamyMist,
    Fog,
    Hurricane,
    ThunderClap,
    Tornado,
    LightningStorm,
  ],
};

export default powerset;
