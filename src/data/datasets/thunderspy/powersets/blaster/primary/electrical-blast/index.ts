/**
 * Electrical Blast Powerset
 * Electrical Blast endows you with ranged electrical attack powers. Electrical powers can drain foes' Endurance and can often temporarily halt their Endurance recovery. This can be quite effective against higher level foes and Bosses. Some Electrical Blast powers can even sometimes transfer this Endurance back to you.
 *
 * Archetype: blaster
 * Category: primary
 * Source: blaster_ranged/electrical_blast
 */

import type { Powerset } from '@/types';

import { ChargedBolts as ChargedBolts } from './charged-bolts';
import { LightningBolt as LightningBolt } from './lightning-bolt';
import { BallLightning as BallLightning } from './ball-lightning';
import { ShortCircuit as ShortCircuit } from './short-circuit';
import { Zapp as Zapp } from './zapp';
import { TeslaCage as TeslaCage } from './tesla-cage';
import { Aim as Aim } from './aim';
import { VoltaicSentinel as VoltaicSentinel } from './voltaic-sentinel';
import { ThunderousBlast as ThunderousBlast } from './thunderous-blast';

export const powerset: Powerset = {
  id: 'blaster/electrical-blast',
  internalName: 'electrical_blast',
  name: 'Electrical Blast',
  description: 'Electrical Blast endows you with ranged electrical attack powers. Electrical powers can drain foes\' Endurance and can often temporarily halt their Endurance recovery. This can be quite effective against higher level foes and Bosses. Some Electrical Blast powers can even sometimes transfer this Endurance back to you.',
  icon: 'electrical_blast_set.ico',
  archetype: 'blaster',
  category: 'primary',
  powers: [
    ChargedBolts,
    LightningBolt,
    BallLightning,
    ShortCircuit,
    Zapp,
    TeslaCage,
    Aim,
    VoltaicSentinel,
    ThunderousBlast,
  ],
};

export default powerset;
