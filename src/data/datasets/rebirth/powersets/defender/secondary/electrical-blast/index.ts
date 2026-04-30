/**
 * Electrical Blast Powerset
 * Electrical Blast endows you with ranged electrical attack powers. Electrical powers can drain foes' Endurance and can often temporarily halt their Endurance recovery. This can be quite effective against higher level foes and Bosses. Some Electrical Blast powers can even sometimes transfer this Endurance back to you.
 *
 * Archetype: defender
 * Category: secondary
 * Source: defender_ranged/electrical_blast
 */

import type { Powerset } from '@/types';

import { ChargedBolts as ChargedBolts } from './charged-bolts';
import { LightningBolt as LightningBolt } from './lightning-bolt';
import { BallLightning as BallLightning } from './ball-lightning';
import { ShortCircuit as ShortCircuit } from './short-circuit';
import { Aim as Aim } from './aim';
import { Zapp as Zapp } from './zapp';
import { TeslaCage as TeslaCage } from './tesla-cage';
import { VoltaicSentinel as VoltaicSentinel } from './voltaic-sentinel';
import { ThunderousBlast as ThunderousBlast } from './thunderous-blast';

export const powerset: Powerset = {
  id: 'defender/electrical-blast',
  name: 'Electrical Blast',
  description: 'Electrical Blast endows you with ranged electrical attack powers. Electrical powers can drain foes\' Endurance and can often temporarily halt their Endurance recovery. This can be quite effective against higher level foes and Bosses. Some Electrical Blast powers can even sometimes transfer this Endurance back to you.',
  icon: 'electrical_blast_set.ico',
  archetype: 'defender',
  category: 'secondary',
  powers: [
    ChargedBolts,
    LightningBolt,
    BallLightning,
    ShortCircuit,
    Aim,
    Zapp,
    TeslaCage,
    VoltaicSentinel,
    ThunderousBlast,
  ],
};

export default powerset;
