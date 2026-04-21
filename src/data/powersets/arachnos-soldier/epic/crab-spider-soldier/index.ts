/**
 * Crab Spider Soldier Powerset
 * Crab Spiders are heavy infantry in the Arachnos Organization, with a wide array of ranged and melee combat skills.
 *
 * Archetype: arachnos-soldier
 * Category: epic
 * Source: arachnos_soldiers/crab_spider_soldier
 */

import type { Powerset } from '@/types';

import { Aim as Aim } from './aim';
import { ArmLash as ArmLash } from './arm-lash';
import { Channelgun as Channelgun } from './channelgun';
import { FragGrenade as FragGrenade } from './cs-frag-grenade';
import { VenomGrenade as VenomGrenade } from './cs-venom-grenade';
import { Frenzy as Frenzy } from './frenzy';
import { Longfang as Longfang } from './longfang';
import { OmegaManeuver as OmegaManeuver } from './omega-maneuver';
import { Slice as Slice } from './slice';
import { Suppression as Suppression } from './suppression';

export const powerset: Powerset = {
  id: 'arachnos-soldier/crab-spider-soldier',
  name: 'Crab Spider Soldier',
  description: 'Crab Spiders are heavy infantry in the Arachnos Organization, with a wide array of ranged and melee combat skills.',
  icon: 'crab_spider_soldier_set.ico',
  archetype: 'arachnos-soldier',
  category: 'epic',
  powers: [
    Aim,
    ArmLash,
    Channelgun,
    FragGrenade,
    VenomGrenade,
    Frenzy,
    Longfang,
    OmegaManeuver,
    Slice,
    Suppression,
  ],
};

export default powerset;
