/**
 * Force Field Powerset
 * The Force Field powers give you the ability to create shells of energy that protect yourself and your allies from various forms of damage and harm. Force Fields do not reduce damage, but reduced your allies chance of getting hit in the first place.
 *
 * Archetype: controller
 * Category: secondary
 * Source: controller_buff/force_field
 */

import type { Powerset } from '@/types';

import { DeflectionShield as DeflectionShield } from './deflection-shield';
import { PersonalForceField as PersonalForceField } from './personal-force-field';
import { RepulsionBolt as RepulsionBolt } from './repulsion-bolt';
import { InsulationShield as InsulationShield } from './insulation-shield';
import { DetentionField as DetentionField } from './detention-field';
import { DispersionBubble as DispersionBubble } from './dispersion-bubble';
import { RepulsionField as RepulsionField } from './repulsion-field';
import { ForceBomb as ForceBomb } from './force-bomb';
import { DampingBubble as DampingBubble } from './damping-bubble';

export const powerset: Powerset = {
  id: 'controller/force-field',
  name: 'Force Field',
  description: 'The Force Field powers give you the ability to create shells of energy that protect yourself and your allies from various forms of damage and harm. Force Fields do not reduce damage, but reduced your allies chance of getting hit in the first place.',
  icon: 'force_field_set.png',
  archetype: 'controller',
  category: 'secondary',
  powers: [
    DeflectionShield,
    PersonalForceField,
    RepulsionBolt,
    InsulationShield,
    DetentionField,
    DispersionBubble,
    RepulsionField,
    ForceBomb,
    DampingBubble,
  ],
};

export default powerset;
