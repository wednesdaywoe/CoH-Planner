/**
 * Obedience Training Powerset
 * Demand compliance from your foes and friends alike with Obedience Training. Most powers are short range, but provide key tactical advantages in battle.
 *
 * Archetype: mastermind
 * Category: secondary
 * Source: mastermind_buff/obedience_training
 */

import type { Powerset } from '@/types';

import { Praise as Praise } from './praise';
import { ViciousMockery as ViciousMockery } from './vicious-mockery';
import { InspireBetrayal as InspireBetrayal } from './inspire-betrayal';
import { DisciplineAllies as DisciplineAllies } from './discipline-allies';
import { IdentifyWeakness as IdentifyWeakness } from './identify-weakness';
import { MotivateAllies as MotivateAllies } from './motivate-allies';
import { BackhandSlap as BackhandSlap } from './backhand-slap';
import { IntimidatingPresence as IntimidatingPresence } from './intimidating-presence';
import { PressOn as PressOn } from './press-on';

export const powerset: Powerset = {
  id: 'mastermind/obedience-training',
  setPath: 'Mastermind_Buff.Obedience_Training',
  name: 'Obedience Training',
  buyRequires: [],
  buyRequiresFailed: "",
  specializeAt: 0,
  specializeRequires: [],
  description: "Demand compliance from your foes and friends alike with Obedience Training. Most powers are short range, but provide key tactical advantages in battle.",
  icon: 'obediencetraining_praise.ico',
  archetype: 'mastermind',
  category: 'secondary',
  powers: [
    Praise,
    ViciousMockery,
    InspireBetrayal,
    DisciplineAllies,
    IdentifyWeakness,
    MotivateAllies,
    BackhandSlap,
    IntimidatingPresence,
    PressOn,
  ],
};

export default powerset;
