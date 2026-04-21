/**
 * Bane Spider Soldier Powerset
 * Bane Spiders are the commandos of the Arachnos organization, providing excellent stealth and offensive capabilities.
 *
 * Archetype: arachnos-soldier
 * Category: epic
 * Source: arachnos_soldiers/bane_spider_soldier
 */

import type { Powerset } from '@/types';

import { Bash as Bash } from './bs-bash';
import { BuildUp as BuildUp } from './build-up';
import { CrowdControl as CrowdControl } from './crowd-control';
import { MaceBeam as MaceBeam } from './mace-beam';
import { MaceBeamBlast as MaceBeamBlast } from './mace-beam-blast';
import { MaceBeamVolley as MaceBeamVolley } from './mace-beam-volley';
import { Placate as Placate } from './placate';
import { PoisonousRay as PoisonousRay } from './poisonous-ray';
import { Pulverize as Pulverize } from './pulverize';
import { Shatter as Shatter } from './shatter';

export const powerset: Powerset = {
  id: 'arachnos-soldier/bane-spider-soldier',
  name: 'Bane Spider Soldier',
  description: 'Bane Spiders are the commandos of the Arachnos organization, providing excellent stealth and offensive capabilities.',
  icon: 'bane_spider_soldier_set.ico',
  archetype: 'arachnos-soldier',
  category: 'epic',
  powers: [
    Bash,
    BuildUp,
    CrowdControl,
    MaceBeam,
    MaceBeamBlast,
    MaceBeamVolley,
    Placate,
    PoisonousRay,
    Pulverize,
    Shatter,
  ],
};

export default powerset;
