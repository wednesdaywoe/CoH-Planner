/**
 * Night Widow Training Powerset
 * With powers of Stealth, and heightened combat skills, coupled with strong mental attacks, the Night Widows of Arachnos are extremely dangerous.
 *
 * Archetype: arachnos-widow
 * Category: epic
 * Source: widow_training/night_widow_training
 */

import type { Powerset } from '@/types';

import { NWMentalBlast as NWMentalBlast } from './nw-mental-blast';
import { BuildUp as BuildUp } from './build-up';
import { NWSmokeGrenade as NWSmokeGrenade } from './nw-smoke-grenade';
import { NWSlash as NWSlash } from './nw-slash';
import { NWEviscerate as NWEviscerate } from './nw-eviscerate';
import { NWPsychicScream as NWPsychicScream } from './nw-psychic-scream';

export const powerset: Powerset = {
  id: 'arachnos-widow/night-widow-training',
  setPath: 'Widow_Training.Night_Widow_Training',
  name: 'Night Widow Training',
  buyRequires: [],
  buyRequiresFailed: "",
  specializeAt: 23,
  specializeRequires: ["Widow_Training.Fortunata_Training","powerset?","Teamwork.Fortunata_Teamwork","powerset?","||","!"],
  description: 'With powers of Stealth, and heightened combat skills, coupled with strong mental attacks, the Night Widows of Arachnos are extremely dangerous.',
  icon: 'night_widow_training_set.ico',
  archetype: 'arachnos-widow',
  category: 'epic',
  powers: [
    NWMentalBlast,
    BuildUp,
    NWSmokeGrenade,
    NWSlash,
    NWEviscerate,
    NWPsychicScream,
  ],
};

export default powerset;
