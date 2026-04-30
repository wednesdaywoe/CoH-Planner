/**
 * Force Field Powerset
 * The Force Field powers give you the ability to create shells of energy that protect yourself and your allies from various forms of damage and harm.  Force Fields do not reduce damage, but reduce your allies chance of getting hit in the first place.
 *
 * Archetype: mastermind
 * Category: secondary
 * Source: mastermind_buff/force_field
 */

import type { Powerset } from '@/types';

import { ForceBolt as ForceBolt } from './force-bolt';
import { DeflectionShield as DeflectionShield } from './deflection-shield';
import { InsulationShield as InsulationShield } from './insulation-shield';
import { BarrierField as BarrierField } from './detention-field';
import { PersonalForceField as PersonalForceField } from './personal-force-field';
import { DispersionBubble as DispersionBubble } from './dispersion-bubble';
import { ContainmentShell as ContainmentShell } from './repulsion-field';
import { RepulsionBomb as RepulsionBomb } from './repulsion-bomb';
import { ForceBubble as ForceBubble } from './force-bubble';
import { RepulsionField as RepulsionField } from './repulsion-field-new';

export const powerset: Powerset = {
  id: 'mastermind/force-field',
  name: 'Force Field',
  description: 'The Force Field powers give you the ability to create shells of energy that protect yourself and your allies from various forms of damage and harm.  Force Fields do not reduce damage, but reduce your allies chance of getting hit in the first place.',
  icon: 'force_field_set.ico',
  archetype: 'mastermind',
  category: 'secondary',
  powers: [
    ForceBolt,
    DeflectionShield,
    InsulationShield,
    BarrierField,
    PersonalForceField,
    DispersionBubble,
    ContainmentShell,
    RepulsionBomb,
    ForceBubble,
    RepulsionField,
  ],
};

export default powerset;
