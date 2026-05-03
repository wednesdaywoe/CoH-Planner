/**
 * Infiltrator Training Powerset
 * You have superb training as an Infiltrator. Your intrusion skills allow you to deftly evade attacks and move behind enemy lines unseen, while your weapons training gives you mastery of a variety of debilitating tools and gadgets to wreak havoc on your unsuspecting foes.
 *
 * Archetype: guardian
 * Category: secondary
 * Source: guardian_comp/infiltrator_training
 */

import type { Powerset } from '@/types';

import { CombatReflexes as CombatReflexes } from './combat-reflexes';
import { WebGrenade as WebGrenade } from './web-grenade';
import { DangerSense as DangerSense } from './danger-sense';
import { TrainedMind as TrainedMind } from './trained-mind';
import { PoisonTrap as PoisonTrap } from './poison-trap';
import { Intrusion as Intrusion } from './intrusion';
import { SeekerDrones as SeekerDrones } from './seeker-drones';
import { BlindingPowder as BlindingPowder } from './blinding-powder';
import { ShredderMine as ShredderMine } from './shredder-mine';

export const powerset: Powerset = {
  id: 'guardian/infiltrator-training',
  name: 'Infiltrator Training',
  description: 'You have superb training as an Infiltrator. Your intrusion skills allow you to deftly evade attacks and move behind enemy lines unseen, while your weapons training gives you mastery of a variety of debilitating tools and gadgets to wreak havoc on your unsuspecting foes.',
  icon: 'ice_armor_set.ico',
  archetype: 'guardian',
  category: 'secondary',
  powers: [
    CombatReflexes,
    WebGrenade,
    DangerSense,
    TrainedMind,
    PoisonTrap,
    Intrusion,
    SeekerDrones,
    BlindingPowder,
    ShredderMine,
  ],
};

export default powerset;
