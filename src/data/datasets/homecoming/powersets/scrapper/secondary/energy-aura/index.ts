/**
 * Energy Aura Powerset
 * You can surround yourself in powerful defensive Energy Auras that can deflect your foes' attacks. Like other defensive powers, Energy Auras do not reduce the damage you take, but rather reduce your chance of getting hit by deflecting your foes' attacks. Energy Auras offer good defense to most attack types, but offer superior defense to Energy based attacks. However, Energy Aura offers no defense to Psionic attacks.
 *
 * Archetype: scrapper
 * Category: secondary
 * Source: scrapper_defense/energy_aura
 */

import type { Powerset } from '@/types';

import { KineticShield as KineticShield } from './kinetic-shield';
import { DampeningField as DampeningField } from './dampening-field';
import { PowerShield as PowerShield } from './power-shield';
import { EntropyShield as EntropyShield } from './entropy-shield';
import { EnergyProtection as EnergyProtection } from './energy-protection';
import { EnergyCloak as EnergyCloak } from './energy-cloak';
import { Efficiency as Efficiency } from './efficiency';
import { EnergyDrain as EnergyDrain } from './energy-drain';
import { Overload as Overload } from './overload';

export const powerset: Powerset = {
  id: 'scrapper/energy-aura',
  setPath: 'Scrapper_Defense.Energy_Aura',
  name: 'Energy Aura',
  buyRequires: [],
  buyRequiresFailed: "",
  specializeAt: 0,
  specializeRequires: [],
  description: 'You can surround yourself in powerful defensive Energy Auras that can deflect your foes\' attacks. Like other defensive powers, Energy Auras do not reduce the damage you take, but rather reduce your chance of getting hit by deflecting your foes\' attacks. Energy Auras offer good defense to most attack types, but offer superior defense to Energy based attacks. However, Energy Aura offers no defense to Psionic attacks.',
  icon: 'energy_aura_set.ico',
  archetype: 'scrapper',
  category: 'secondary',
  powers: [
    KineticShield,
    DampeningField,
    PowerShield,
    EntropyShield,
    EnergyProtection,
    EnergyCloak,
    Efficiency,
    EnergyDrain,
    Overload,
  ],
};

export default powerset;
