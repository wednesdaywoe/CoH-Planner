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
import { RepulsionBolt as RepulsionBolt } from './repulsion-bolt';
import { InsulationShield as InsulationShield } from './insulation-shield';
import { DetentionField as DetentionField } from './detention-field';
import { PersonalForceField as PersonalForceField } from './personal-force-field';
import { DispersionBubble as DispersionBubble } from './dispersion-bubble';
import { RepulsionField as RepulsionField } from './repulsion-field';
import { ForceBomb as ForceBomb } from './force-bomb';
import { DampingBubble as DampingBubble } from './damping-bubble';

export const powerset: Powerset = {
  id: 'mastermind/force-field',
  name: 'Force Field',
  description: 'The Force Field powers give you the ability to create shells of energy that protect yourself and your allies from various forms of damage and harm. Force Fields do not reduce damage, but reduce your allies chance of getting hit in the first place.',
  icon: 'force_field_set.png',
  archetype: 'mastermind',
  category: 'secondary',
  powers: [
    DeflectionShield,
    RepulsionBolt,
    InsulationShield,
    DetentionField,
    PersonalForceField,
    DispersionBubble,
    RepulsionField,
    ForceBomb,
    DampingBubble,
  ],
};

export default powerset;
