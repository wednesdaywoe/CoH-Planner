/**
 * Mace Assault Powerset
 * You can wield a Nullifier Mace, a high tech mace that is as good at blasting enemies as it is at smashing them to pieces.
 *
 * Archetype: guardian
 * Category: primary
 * Source: guardian_assault/mace_assault
 */

import type { Powerset } from '@/types';

import { MaceBeam as MaceBeam } from './mace-beam';
import { Bash as Bash } from './bash';
import { MaceBeamBlast as MaceBeamBlast } from './mace-beam-blast';
import { Pulverize as Pulverize } from './pulverize';
import { BuildUp as BuildUp } from './build-up';
import { PoisonousRay as PoisonousRay } from './poisonous-ray';
import { MaceBeamVolley as MaceBeamVolley } from './mace-beam-volley';
import { Shatter as Shatter } from './shatter';
import { CrowdControl as CrowdControl } from './crowd-control';

export const powerset: Powerset = {
  id: 'guardian/mace-assault',
  name: 'Mace Assault',
  description: 'You can wield a Nullifier Mace, a high tech mace that is as good at blasting enemies as it is at smashing them to pieces.',
  icon: 'weapon_mastery_set.ico',
  archetype: 'guardian',
  category: 'primary',
  powers: [
    MaceBeam,
    Bash,
    MaceBeamBlast,
    Pulverize,
    BuildUp,
    PoisonousRay,
    MaceBeamVolley,
    Shatter,
    CrowdControl,
  ],
};

export default powerset;
