/**
 * Traps Powerset
 * Traps are devices and gadgets you construct to cripple your foes. By using them strategically, you can gain a great tactical advantage. Traps include ambush devises, as well as gadgets that can be constructed to aid you and your allies.
 *
 * Archetype: mastermind
 * Category: secondary
 * Source: mastermind_buff/traps
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
import { Detonator as Detonator } from './detonator';

export const powerset: Powerset = {
  id: 'mastermind/traps',
  name: 'Traps',
  description: 'Traps are devices and gadgets you construct to cripple your foes. By using them strategically, you can gain a great tactical advantage. Traps include ambush devises, as well as gadgets that can be constructed to aid you and your allies.',
  icon: 'traps_set.png',
  archetype: 'mastermind',
  category: 'secondary',
  powers: [
    Caltrops,
    WebGrenade,
    TriageBeacon,
    AcidMortar,
    ForceFieldGenerator,
    PoisonTrap,
    SeekerDrones,
    TripMine,
    Detonator,
  ],
};

export default powerset;
