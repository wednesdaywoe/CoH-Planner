/**
 * Cold Domination Powerset
 * Cold Domination powers allow you to manipulate cold and ice to protect your allies and weaken your enemies.
 *
 * Archetype: defender
 * Category: primary
 * Source: defender_buff/cold_domination
 */

import type { Powerset } from '@/types';

import { ArcticFog as ArcticFog } from './arctic-fog';
import { Benumb as Benumb } from './benumb';
import { Frostwork as Frostwork } from './frostwork';
import { GlacialShield as GlacialShield } from './glacial-shield';
import { HeatLoss as HeatLoss } from './heat-loss';
import { IceShield as IceShield } from './ice-shield';
import { Infrigidate as Infrigidate } from './infrigidate';
import { Sleet as Sleet } from './sleet';
import { SnowStorm as SnowStorm } from './snow-storm';

export const powerset: Powerset = {
  id: 'defender/cold-domination',
  name: 'Cold Domination',
  description: 'Cold Domination powers allow you to manipulate cold and ice to protect your allies and weaken your enemies.',
  icon: 'cold_domination_set.ico',
  archetype: 'defender',
  category: 'primary',
  powers: [
    ArcticFog,
    Benumb,
    Frostwork,
    GlacialShield,
    HeatLoss,
    IceShield,
    Infrigidate,
    Sleet,
    SnowStorm,
  ],
};

export default powerset;
