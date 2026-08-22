/**
 * Force Field Powerset
 * The Force Field powers give you the ability to create shells of energy that protect yourself and your allies from various forms of damage and harm.  Force Fields do not reduce damage, but reduced your allies chance of getting hit in the first place.
 *
 * Archetype: corruptor
 * Category: secondary
 * Source: corruptor_buff/force_field
 */

import type { Powerset } from '@/types';

import { RepulsionFieldNew as RepulsionFieldNew } from './repulsion-field-new';
import { PersonalForceField as PersonalForceField } from './personal-force-field';
import { DeflectionShield as DeflectionShield } from './deflection-shield';
import { ForceBolt as ForceBolt } from './force-bolt';
import { InsulationShield as InsulationShield } from './insulation-shield';
import { RefractionShield as RefractionShield } from './refraction-shield';
import { DispersionBubble as DispersionBubble } from './dispersion-bubble';
import { RepulsionField as RepulsionField } from './repulsion-field';
import { RepulsionBomb as RepulsionBomb } from './repulsion-bomb';
import { ForceBubble as ForceBubble } from './force-bubble';

export const powerset: Powerset = {
  id: 'corruptor/force-field',
  setPath: 'Corruptor_Buff.Force_Field',
  name: 'Force Field',
  buyRequires: [],
  buyRequiresFailed: "",
  specializeAt: 0,
  specializeRequires: [],
  description: "The Force Field powers give you the ability to create shells of energy that protect yourself and your allies from various forms of damage and harm.  Force Fields do not reduce damage, but reduced your allies chance of getting hit in the first place.",
  icon: 'force_field_set.ico',
  archetype: 'corruptor',
  category: 'secondary',
  powers: [
    RepulsionFieldNew,
    PersonalForceField,
    DeflectionShield,
    ForceBolt,
    InsulationShield,
    RefractionShield,
    DispersionBubble,
    RepulsionField,
    RepulsionBomb,
    ForceBubble,
  ],
};

export default powerset;
