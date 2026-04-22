/**
 * Energy Aura Powerset
 * You can surround yourself in powerful defensive Energy Auras that can deflect your foes' attacks. Like other defensive powers, Energy Auras do not reduce the damage you take, but rather reduce your chance of getting hit by deflecting your foes' attacks. Energy Auras offer good defense to most attack types, but offer superior defense to Energy based attacks. However, Energy Aura offers no defense to Psionic attacks.
 *
 * Archetype: stalker
 * Category: secondary
 * Source: stalker_defense/energy_aura
 */

import type { Powerset } from '@/types';

import { Energize as Energize } from './conserve-power';
import { EnergyDrain as EnergyDrain } from './energy-drain';
import { KineticDampening as KineticDampening } from './energy-protection';
import { EntropyShield as EntropyShield } from './entropy-shield';
import { Hide as Hide } from './hide';
import { KineticShield as KineticShield } from './kinetic-shield';
import { Overload as Overload } from './overload';
import { PowerShield as PowerShield } from './power-shield';
import { Disrupt as Disrupt } from './repulse';

export const powerset: Powerset = {
  id: 'stalker/energy-aura',
  name: 'Energy Aura',
  description: 'You can surround yourself in powerful defensive Energy Auras that can deflect your foes\' attacks. Like other defensive powers, Energy Auras do not reduce the damage you take, but rather reduce your chance of getting hit by deflecting your foes\' attacks. Energy Auras offer good defense to most attack types, but offer superior defense to Energy based attacks. However, Energy Aura offers no defense to Psionic attacks.',
  icon: 'energy_aura_set.ico',
  archetype: 'stalker',
  category: 'secondary',
  powers: [
    Energize,
    EnergyDrain,
    KineticDampening,
    EntropyShield,
    Hide,
    KineticShield,
    Overload,
    PowerShield,
    Disrupt,
  ],
};

export default powerset;
