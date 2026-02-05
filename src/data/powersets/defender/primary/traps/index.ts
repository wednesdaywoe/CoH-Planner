/**
 * Traps Powerset
 * Traps are devices and gadgets you construct to cripple your foes. By using them strategically, you can gain a great tactical advantage. Traps include ambush devises, as well as gadgets that can be constructed to aid you and your allies.
 *
 * Archetype: defender
 * Category: primary
 * Source: defender_buff/traps
 */

import type { Powerset } from '@/types';

import { Caltrops as Caltrops } from './caltrops';
import { WebGrenade as WebGrenade } from './web-grenade';
import { TriageBeacon as TriageBeacon } from './triage-beacon';
import { AcidMortar as AcidMortar } from './acid-mortar';
import { ForceFieldGenerator as ForceFieldGenerator } from './force-field-generator';
import { PoisonTrap as PoisonTrap } from './poison-trap';
import { SeekerDrones as SeekerDrones } from './seeker-drones';
import { TripMine as TripMine } from './trip-mine';
import { TemporalBomb as TemporalBomb } from './temporal-bomb';

export const powerset: Powerset = {
  id: 'defender/traps',
  name: 'Traps',
  description: 'Traps are devices and gadgets you construct to cripple your foes. By using them strategically, you can gain a great tactical advantage. Traps include ambush devises, as well as gadgets that can be constructed to aid you and your allies.',
  icon: 'traps_set.png',
  archetype: 'defender',
  category: 'primary',
  powers: [
    Caltrops,
    WebGrenade,
    TriageBeacon,
    AcidMortar,
    ForceFieldGenerator,
    PoisonTrap,
    SeekerDrones,
    TripMine,
    TemporalBomb,
  ],
};

export default powerset;
