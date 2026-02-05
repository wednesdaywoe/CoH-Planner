/**
 * Electrical Affinity Powerset
 * You are able to control and manipulate electricity to aid your allies and weaken your enemies. Some Electrical Affinity powers build Static, which increases the number of targets your Circuit powers can chain to.
 *
 * Archetype: controller
 * Category: secondary
 * Source: controller_buff/shock_therapy
 */

import type { Powerset } from '@/types';

import { RejuvenatingCircuit as RejuvenatingCircuit } from './rejuvenating-circuit';
import { Shock as Shock } from './shock';
import { GalvanicSentinel as GalvanicSentinel } from './galvanic-sentinel';
import { EnergizingCircuit as EnergizingCircuit } from './energizing-circuit';
import { FaradayCage as FaradayCage } from './faraday-cage';
import { EmpoweringCircuit as EmpoweringCircuit } from './empowering-circuit';
import { Defibrillate as Defibrillate } from './defibrillate';
import { InsulatingCircuit as InsulatingCircuit } from './insulating-circuit';
import { AmpUp as AmpUp } from './amp-up';

export const powerset: Powerset = {
  id: 'controller/electrical-affinity',
  name: 'Electrical Affinity',
  description: 'You are able to control and manipulate electricity to aid your allies and weaken your enemies. Some Electrical Affinity powers build Static, which increases the number of targets your Circuit powers can chain to.',
  icon: 'shock_therapy_set.png',
  archetype: 'controller',
  category: 'secondary',
  powers: [
    RejuvenatingCircuit,
    Shock,
    GalvanicSentinel,
    EnergizingCircuit,
    FaradayCage,
    EmpoweringCircuit,
    Defibrillate,
    InsulatingCircuit,
    AmpUp,
  ],
};

export default powerset;
