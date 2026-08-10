/**
 * Widow Teamwork Powerset
 * Night Widows receive advanced Teamwork Training, couple with advanced defensive techniques of their own.
 *
 * Archetype: arachnos-widow
 * Category: epic
 * Source: teamwork/widow_teamwork
 */

import type { Powerset } from '@/types';

import { NWMaskPresence as NWMaskPresence } from './nw-mask-presence';
import { MentalTraining as MentalTraining } from './mental-training';
import { NWMindLink as NWMindLink } from './nw-mind-link';
import { Placate as Placate } from './placate';
import { NWTacticalTrainingVengeance as NWTacticalTrainingVengeance } from './nw-tactical-training-vengeance';
import { Elude as Elude } from './elude';

export const powerset: Powerset = {
  id: 'arachnos-widow/widow-teamwork',
  setPath: 'Teamwork.Widow_Teamwork',
  name: 'Widow Teamwork',
  buyRequires: [],
  buyRequiresFailed: "",
  specializeAt: 0,
  specializeRequires: [],
  description: 'Night Widows receive advanced Teamwork Training, couple with advanced defensive techniques of their own.',
  icon: 'widow_teamwork_set.ico',
  archetype: 'arachnos-widow',
  category: 'epic',
  powers: [
    NWMaskPresence,
    MentalTraining,
    NWMindLink,
    Placate,
    NWTacticalTrainingVengeance,
    Elude,
  ],
};

export default powerset;
