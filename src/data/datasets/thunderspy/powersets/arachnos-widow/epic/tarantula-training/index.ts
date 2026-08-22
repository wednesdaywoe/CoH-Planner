/**
 * Tarantula Training Powerset
 * Tarantula Training
 *
 * Archetype: arachnos-widow
 * Category: epic
 * Source: widow_training/tarantula_training
 */

import type { Powerset } from '@/types';

import { TRClawPierce as TRClawPierce } from './tr-claw-pierce';
import { TRVenomBolt as TRVenomBolt } from './tr-venom-bolt';
import { TRPlasmaCannon as TRPlasmaCannon } from './tr-plasma-cannon';
import { TRBuildUp as TRBuildUp } from './tr-build-up';
import { TRClawShred as TRClawShred } from './tr-claw-shred';
import { TRWebSpitter as TRWebSpitter } from './tr-web-spitter';
import { TRCocoon as TRCocoon } from './tr-cocoon';
import { TRVenomBurst as TRVenomBurst } from './tr-venom-burst';

export const powerset: Powerset = {
  id: 'arachnos-widow/tarantula-training',
  setPath: 'Widow_Training.Tarantula_Training',
  name: 'Tarantula Training',
  buyRequires: [],
  buyRequiresFailed: "",
  specializeAt: 23,
  specializeRequires: ["Widow_Training.Night_Widow_Training","powerset?","Teamwork.Widow_Teamwork","powerset?","||","Widow_Training.Fortunata_Training","powerset?","Teamwork.Fortunata_Teamwork","powerset?","||","||","!"],
  description: "Tarantula Training",
  icon: 'tarantula_training_set.png',
  archetype: 'arachnos-widow',
  category: 'epic',
  powers: [
    TRClawPierce,
    TRVenomBolt,
    TRPlasmaCannon,
    TRBuildUp,
    TRClawShred,
    TRWebSpitter,
    TRCocoon,
    TRVenomBurst,
  ],
};

export default powerset;
