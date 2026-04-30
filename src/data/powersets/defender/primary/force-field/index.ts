/**
 * Force Field Powerset
 * The Force Field powers give you the ability to create shells of energy that protect yourself and your allies from various forms of damage and harm. Force Fields do not reduce damage, but reduced your allies chance of getting hit in the first place.
 *
 * Archetype: defender
 * Category: primary
 * Source: defender_buff/force_field
 */

import type { Powerset } from '@/types';

import { PersonalForceField as PersonalForceField } from './personal-force-field';
import { DeflectionShield as DeflectionShield } from './deflection-shield';
import { RepulsionBolt as RepulsionBolt } from './force-bolt';
import { InsulationShield as InsulationShield } from './insulation-shield';
import { DetentionField as DetentionField } from './refraction-shield';
import { DispersionBubble as DispersionBubble } from './dispersion-bubble';
import { RepulsionField as RepulsionField } from './repulsion-field';
import { ForceBomb as ForceBomb } from './repulsion-bomb';
import { DampingBubble as DampingBubble } from './force-bubble';

export const powerset: Powerset = {
  id: 'defender/force-field',
  name: 'Force Field',
  description: 'The Force Field powers give you the ability to create shells of energy that protect yourself and your allies from various forms of damage and harm. Force Fields do not reduce damage, but reduced your allies chance of getting hit in the first place.',
  icon: 'force_field_set.ico',
  archetype: 'defender',
  category: 'primary',
  powers: [
    PersonalForceField,
    DeflectionShield,
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
