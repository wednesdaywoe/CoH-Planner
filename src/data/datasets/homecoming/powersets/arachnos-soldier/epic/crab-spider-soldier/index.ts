/**
 * Crab Spider Soldier Powerset
 * Crab Spiders are heavy infantry in the Arachnos Organization, with a wide array of ranged and melee combat skills.
 *
 * Archetype: arachnos-soldier
 * Category: epic
 * Source: arachnos_soldiers/crab_spider_soldier
 */

import type { Powerset } from '@/types';

import { Channelgun as Channelgun } from './channelgun';
import { Slice as Slice } from './slice';
import { Longfang as Longfang } from './longfang';
import { Aim as Aim } from './aim';
import { Suppression as Suppression } from './suppression';
import { ArmLash as ArmLash } from './arm-lash';
import { VenomGrenade as VenomGrenade } from './cs-venom-grenade';
import { FragGrenade as FragGrenade } from './cs-frag-grenade';
import { Frenzy as Frenzy } from './frenzy';
import { OmegaManeuver as OmegaManeuver } from './omega-maneuver';

export const powerset: Powerset = {
  id: 'arachnos-soldier/crab-spider-soldier',
  name: 'Crab Spider Soldier',
  description: 'Crab Spiders are heavy infantry in the Arachnos Organization, with a wide array of ranged and melee combat skills.',
  icon: 'crab_spider_soldier_set.ico',
  archetype: 'arachnos-soldier',
  category: 'epic',
  powers: [
    Channelgun,
    Slice,
    Longfang,
    Aim,
    Suppression,
    ArmLash,
    VenomGrenade,
    FragGrenade,
    Frenzy,
    OmegaManeuver,
  ],
};

export default powerset;
