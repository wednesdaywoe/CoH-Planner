/**
 * Bane Spider Soldier Powerset
 * Bane Spiders are elite operatives of the Arachnos Organization. Armed with the powerful
 * Nullifier Mace, they combine strong melee attacks with ranged energy blasts and stealth tactics.
 *
 * Archetype: arachnos-soldier
 * Category: Epic
 */

import type { Powerset } from '@/types';

import { Bash } from './bash';
import { MaceBeam } from './mace-beam';
import { MaceBeamBlast } from './mace-beam-blast';
import { BuildUp } from './build-up';
import { MaceBeamVolley } from './mace-beam-volley';
import { PoisonousRay } from './poisonous-ray';
import { Pulverize } from './pulverize';
import { Shatter } from './shatter';
import { Placate } from './placate';
import { CrowdControl } from './crowd-control';

export const powerset: Powerset = {
  id: 'arachnos-soldier/bane-spider-soldier',
  name: 'Bane Spider Soldier',
  description: 'Bane Spiders are elite operatives of the Arachnos Organization. Armed with the powerful Nullifier Mace, they combine strong melee attacks with ranged energy blasts and stealth tactics.',
  icon: 'bane_spider_soldier_set.png',
  archetype: 'arachnos-soldier',
  category: 'epic',
  powers: [
    Bash,
    MaceBeam,
    MaceBeamBlast,
    BuildUp,
    MaceBeamVolley,
    PoisonousRay,
    Pulverize,
    Shatter,
    Placate,
    CrowdControl,
  ],
};

export default powerset;
