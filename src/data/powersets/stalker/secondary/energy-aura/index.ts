/**
 * Energy Aura Powerset
 * You can surround yourself in powerful defensive Energy Auras that can deflect your foes' attacks. Like other defensive powers, Energy Auras do not reduce the damage you take, but rather reduce your chance of getting hit by deflecting your foes' attacks. Energy Auras offer good defense to most attack types, but offer superior defense to Energy based attacks. However, Energy Aura offers no defense to Psionic attacks.
 *
 * Archetype: stalker
 * Category: secondary
 * Source: stalker_defense/energy_aura
 */

import type { Powerset } from '@/types';

import { Hide as Hide } from './hide';
import { KineticShield as KineticShield } from './kinetic-shield';
import { PowerShield as PowerShield } from './power-shield';
import { EntropyShield as EntropyShield } from './entropy-shield';
import { KineticDampening as KineticDampening } from './kinetic-dampening';
import { Disrupt as Disrupt } from './disrupt';
import { EnergyDrain as EnergyDrain } from './energy-drain';
import { Energize as Energize } from './energize';
import { Overload as Overload } from './overload';

export const powerset: Powerset = {
  id: 'stalker/energy-aura',
  name: 'Energy Aura',
  description: 'You can surround yourself in powerful defensive Energy Auras that can deflect your foes\' attacks. Like other defensive powers, Energy Auras do not reduce the damage you take, but rather reduce your chance of getting hit by deflecting your foes\' attacks. Energy Auras offer good defense to most attack types, but offer superior defense to Energy based attacks. However, Energy Aura offers no defense to Psionic attacks.',
  icon: 'energy_aura_set.png',
  archetype: 'stalker',
  category: 'secondary',
  powers: [
    Hide,
    KineticShield,
    PowerShield,
    EntropyShield,
    KineticDampening,
    Disrupt,
    EnergyDrain,
    Energize,
    Overload,
  ],
};

export default powerset;
