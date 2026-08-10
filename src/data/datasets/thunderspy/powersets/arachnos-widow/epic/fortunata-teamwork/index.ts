/**
 * Fortunata Teamwork Powerset
 * Fortunata's receive advanced Teamwork Training, couple with advanced defensive techniques of their own.
 *
 * Archetype: arachnos-widow
 * Category: epic
 * Source: teamwork/fortunata_teamwork
 */

import type { Powerset } from '@/types';

import { FRTMaskPresence as FRTMaskPresence } from './frt-mask-presence';
import { FRTMindLink as FRTMindLink } from './frt-mind-link';
import { Confuse as Confuse } from './confuse';
import { FRTTacticalTrainingVengeance as FRTTacticalTrainingVengeance } from './frt-tactical-training-vengeance';
import { AuraofConfusion as AuraofConfusion } from './aura-of-confusion';

export const powerset: Powerset = {
  id: 'arachnos-widow/fortunata-teamwork',
  setPath: 'Teamwork.Fortunata_Teamwork',
  name: 'Fortunata Teamwork',
  buyRequires: [],
  buyRequiresFailed: "",
  specializeAt: 23,
  specializeRequires: ["Widow_Training.Night_Widow_Training","powerset?","Teamwork.Widow_Teamwork","powerset?","||","Widow_Training.Tarantula_Training","powerset?","Teamwork.Tarantula_Teamwork","powerset?","||","||","!"],
  description: 'Fortunata\'s receive advanced Teamwork Training, couple with advanced defensive techniques of their own.',
  icon: 'fortunata_teamwork_set.ico',
  archetype: 'arachnos-widow',
  category: 'epic',
  powers: [
    FRTMaskPresence,
    FRTMindLink,
    Confuse,
    FRTTacticalTrainingVengeance,
    AuraofConfusion,
  ],
};

export default powerset;
