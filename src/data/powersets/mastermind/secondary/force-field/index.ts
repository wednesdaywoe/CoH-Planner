/**
 * Force Field Powerset
 * The Force Field powers give you the ability to create shells of energy that protect yourself and your allies from various forms of damage and harm. Force Fields do not reduce damage, but reduce your allies chance of getting hit in the first place.
 *
 * Archetype: mastermind
 * Category: secondary
 * Source: mastermind_buff/force_field
 */

import type { Powerset } from '@/types';

import { DeflectionShield as DeflectionShield } from './deflection-shield';
import { DetentionField as DetentionField } from './detention-field';
import { DispersionBubble as DispersionBubble } from './dispersion-bubble';
import { RepulsionBolt as RepulsionBolt } from './force-bolt';
import { DampingBubble as DampingBubble } from './force-bubble';
import { InsulationShield as InsulationShield } from './insulation-shield';
import { PersonalForceField as PersonalForceField } from './personal-force-field';
import { ForceBomb as ForceBomb } from './repulsion-bomb';
import { RepulsionField as RepulsionField } from './repulsion-field';

export const powerset: Powerset = {
  id: 'mastermind/force-field',
  name: 'Force Field',
  description: 'The Force Field powers give you the ability to create shells of energy that protect yourself and your allies from various forms of damage and harm. Force Fields do not reduce damage, but reduce your allies chance of getting hit in the first place.',
  icon: 'force_field_set.ico',
  archetype: 'mastermind',
  category: 'secondary',
  powers: [
    DeflectionShield,
    DetentionField,
    DispersionBubble,
    RepulsionBolt,
    DampingBubble,
    InsulationShield,
    PersonalForceField,
    ForceBomb,
    RepulsionField,
  ],
};

export default powerset;
