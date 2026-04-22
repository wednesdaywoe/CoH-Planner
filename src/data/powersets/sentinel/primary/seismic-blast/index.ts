/**
 * Seismic Blast Powerset
 * You can manipulate earth and stone to defeat your foes. The crushing force of many Earth Powers can reduce a target's Defense. Being of the Earth, you are the most powerful while on the ground. While grounded, your attacks increase Seismic Pressure. As your Seismic Pressure increases, your chance of triggering Seismic Shockwaves increases and the cooldown of other Seismic Blast attacks is slightly reduced. These Seismic Shockwaves will have the chance of knocking down foes and, while standing on the ground, empower some of your attacks; Rock Shards will have its area and target cap increased, Seismic Force will decrease the cooldown of all recharging Seismic Blast attacks by a moderate amount, and Stalagmite will deal a large amount of damage.
 *
 * Archetype: sentinel
 * Category: primary
 * Source: sentinel_ranged/seismic_blast
 */

import type { Powerset } from '@/types';

import { Encase as Encase } from './encase';
import { Entomb as Entomb } from './entomb';
import { Gravestone as Gravestone } from './gravestone';
import { Meteor as Meteor } from './meteor';
import { RockShards as RockShards } from './rock-shards';
import { SeismicForce as SeismicForce } from './seismic-force';
import { Shatter as Shatter } from './shatter';
import { SeismicShockwaves as SeismicShockwaves } from './shockwaves';
import { Stalagmite as Stalagmite } from './stalagmite';
import { Upthrust as Upthrust } from './upthrust';

export const powerset: Powerset = {
  id: 'sentinel/seismic-blast',
  name: 'Seismic Blast',
  description: 'You can manipulate earth and stone to defeat your foes. The crushing force of many Earth Powers can reduce a target\'s Defense. Being of the Earth, you are the most powerful while on the ground. While grounded, your attacks increase Seismic Pressure. As your Seismic Pressure increases, your chance of triggering Seismic Shockwaves increases and the cooldown of other Seismic Blast attacks is slightly reduced. These Seismic Shockwaves will have the chance of knocking down foes and, while standing on the ground, empower some of your attacks; Rock Shards will have its area and target cap increased, Seismic Force will decrease the cooldown of all recharging Seismic Blast attacks by a moderate amount, and Stalagmite will deal a large amount of damage.',
  icon: 'archery_set.ico',
  archetype: 'sentinel',
  category: 'primary',
  powers: [
    Encase,
    Entomb,
    Gravestone,
    Meteor,
    RockShards,
    SeismicForce,
    Shatter,
    SeismicShockwaves,
    Stalagmite,
    Upthrust,
  ],
};

export default powerset;
