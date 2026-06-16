/**
 * Force Field Powerset
 * The Force Field powers give you the ability to create shells of energy that protect yourself and your allies from various forms of damage and harm.  Force Fields do not reduce damage, but reduced your allies chance of getting hit in the first place.
 *
 * Archetype: corruptor
 * Category: secondary
 * Source: corruptor_buff/force_field
 */

import type { Powerset } from '@/types';

import { DeflectionShield as DeflectionShield } from './deflection-shield';
import { PersonalForceField as PersonalForceField } from './personal-force-field';
import { InsulationShield as InsulationShield } from './insulation-shield';
import { ForceBolt as ForceBolt } from './force-bolt';
import { DispersionBubble as DispersionBubble } from './dispersion-bubble';
import { RepulsionField as RepulsionField } from './repulsion-field';
import { RefractionShield as RefractionShield } from './refraction-shield';
import { RepulsionBomb as RepulsionBomb } from './repulsion-bomb';
import { ForceBubble as ForceBubble } from './force-bubble';

export const powerset: Powerset = {
  id: 'corruptor/force-field',
  name: 'Force Field',
  description: 'The Force Field powers give you the ability to create shells of energy that protect yourself and your allies from various forms of damage and harm.  Force Fields do not reduce damage, but reduced your allies chance of getting hit in the first place.',
  icon: 'force_field_set.ico',
  archetype: 'corruptor',
  category: 'secondary',
  powers: [
    DeflectionShield,
    PersonalForceField,
    InsulationShield,
    ForceBolt,
    DispersionBubble,
    RepulsionField,
    RefractionShield,
    RepulsionBomb,
    ForceBubble,
  ],
};

export default powerset;
