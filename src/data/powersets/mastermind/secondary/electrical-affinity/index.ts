/**
 * Electrical Affinity Powerset
 * You are able to control and manipulate electricity to aid your allies and weaken your enemies. Some Electrical Affinity powers build Static, which increases the number of targets your Circuit powers can chain to.
 *
 * Archetype: mastermind
 * Category: secondary
 * Source: mastermind_buff/shock_therapy
 */

import type { Powerset } from '@/types';

import { AmpUp as AmpUp } from './amp-up';
import { Defibrillate as Defibrillate } from './defibrillate';
import { Discharge as Discharge } from './discharge';
import { EmpoweringCircuit as EmpoweringCircuit } from './empowering-circuit';
import { EnergizingCircuit as EnergizingCircuit } from './energizing-circuit';
import { FaradayCage as FaradayCage } from './faraday-cage';
import { InsulatingCircuit as InsulatingCircuit } from './insulating-circuit';
import { RejuvenatingCircuit as RejuvenatingCircuit } from './rejuvenating-circuit';
import { Shock as Shock } from './shock';

export const powerset: Powerset = {
  id: 'mastermind/electrical-affinity',
  name: 'Electrical Affinity',
  description: 'You are able to control and manipulate electricity to aid your allies and weaken your enemies. Some Electrical Affinity powers build Static, which increases the number of targets your Circuit powers can chain to.',
  icon: 'shock_therapy_set.ico',
  archetype: 'mastermind',
  category: 'secondary',
  powers: [
    AmpUp,
    Defibrillate,
    Discharge,
    EmpoweringCircuit,
    EnergizingCircuit,
    FaradayCage,
    InsulatingCircuit,
    RejuvenatingCircuit,
    Shock,
  ],
};

export default powerset;
