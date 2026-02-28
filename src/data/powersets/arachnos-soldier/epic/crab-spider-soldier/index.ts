/**
 * Crab Spider Soldier Powerset
 * Crab Spiders are heavy infantry in the Arachnos Organization. Their distinctive backpack
 * provides powerful ranged energy weapons and devastating melee claw attacks.
 *
 * Archetype: arachnos-soldier
 * Category: Epic
 */

import type { Powerset } from '@/types';

import { Channelgun } from './channelgun';
import { Slice } from './slice';
import { Longfang } from './longfang';
import { Aim } from './aim';
import { Suppression } from './suppression';
import { ArmLash } from './arm-lash';
import { VenomGrenade } from './venom-grenade';
import { FragGrenade } from './frag-grenade';
import { Frenzy } from './frenzy';
import { OmegaManeuver } from './omega-maneuver';

export const powerset: Powerset = {
  id: 'arachnos-soldier/crab-spider-soldier',
  name: 'Crab Spider Soldier',
  description: 'Crab Spiders are heavy infantry in the Arachnos Organization. Their distinctive backpack provides powerful ranged energy weapons and devastating melee claw attacks.',
  icon: 'crab_spider_soldier_set.png',
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
