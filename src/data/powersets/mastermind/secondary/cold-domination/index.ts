/**
 * Cold Domination Powerset
 * Cold Domination powers allow you to manipulate cold and ice to protect your allies and weaken your enemies.
 *
 * Archetype: mastermind
 * Category: secondary
 * Source: mastermind_buff/cold_domination
 */

import type { Powerset } from '@/types';

import { IceShield as IceShield } from './ice-shield';
import { Infrigidate as Infrigidate } from './infrigidate';
import { SnowStorm as SnowStorm } from './snow-storm';
import { GlacialShield as GlacialShield } from './glacial-shield';
import { Frostwork as Frostwork } from './frostwork';
import { ArcticFog as ArcticFog } from './arctic-fog';
import { Benumb as Benumb } from './benumb';
import { Sleet as Sleet } from './sleet';
import { HeatLoss as HeatLoss } from './heat-loss';

export const powerset: Powerset = {
  id: 'mastermind/cold-domination',
  name: 'Cold Domination',
  description: 'Cold Domination powers allow you to manipulate cold and ice to protect your allies and weaken your enemies.',
  icon: 'cold_domination_set.png',
  archetype: 'mastermind',
  category: 'secondary',
  powers: [
    IceShield,
    Infrigidate,
    SnowStorm,
    GlacialShield,
    Frostwork,
    ArcticFog,
    Benumb,
    Sleet,
    HeatLoss,
  ],
};

export default powerset;
