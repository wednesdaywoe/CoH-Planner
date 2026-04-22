/**
 * Electrical Blast Powerset
 * Electrical Blast endows you with ranged electrical attack powers. Electrical powers can drain foes' Endurance and can often temporarily halt their Endurance recovery. This can be quite effective against higher level foes and Bosses. As you drain endurance, Electrical Blast powers can even sometimes Shock targets do deal bonus damage, hinder recovery, and transfer this Endurance back to you.
 *
 * Archetype: defender
 * Category: secondary
 * Source: defender_ranged/electrical_blast
 */

import type { Powerset } from '@/types';

import { ChargeUp as ChargeUp } from './aim';
import { BallLightning as BallLightning } from './ball-lightning';
import { ChargedBolts as ChargedBolts } from './charged-bolts';
import { LightningBolt as LightningBolt } from './lightning-bolt';
import { ShortCircuit as ShortCircuit } from './short-circuit';
import { TeslaCage as TeslaCage } from './tesla-cage';
import { ThunderousBlast as ThunderousBlast } from './thunderous-blast';
import { VoltaicSentinel as VoltaicSentinel } from './voltaic-sentinel';
import { Zapp as Zapp } from './zapp';

export const powerset: Powerset = {
  id: 'defender/electrical-blast',
  name: 'Electrical Blast',
  description: 'Electrical Blast endows you with ranged electrical attack powers. Electrical powers can drain foes\' Endurance and can often temporarily halt their Endurance recovery. This can be quite effective against higher level foes and Bosses. As you drain endurance, Electrical Blast powers can even sometimes Shock targets do deal bonus damage, hinder recovery, and transfer this Endurance back to you.',
  icon: 'electrical_blast_set.ico',
  archetype: 'defender',
  category: 'secondary',
  powers: [
    ChargeUp,
    BallLightning,
    ChargedBolts,
    LightningBolt,
    ShortCircuit,
    TeslaCage,
    ThunderousBlast,
    VoltaicSentinel,
    Zapp,
  ],
};

export default powerset;
