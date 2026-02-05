/**
 * Energy Aura Powerset
 * You can surround yourself in powerful defensive Energy Auras that can deflect your foes' attacks. Like other defensive powers, Energy Auras do not reduce the damage you take, but rather reduce your chance of getting hit by deflecting your foes' attacks. Energy Auras offer good defense to most attack types, but offer superior defense to Energy based attacks. However, Energy Aura offers no defense to Psionic attacks.
 *
 * Archetype: brute
 * Category: secondary
 * Source: brute_defense/energy_aura
 */

import type { Powerset } from '@/types';

import { DampeningField as DampeningField } from './dampening-field';
import { KineticShield as KineticShield } from './kinetic-shield';
import { PowerShield as PowerShield } from './power-shield';
import { EntropicAura as EntropicAura } from './entropic-aura';
import { EnergyProtection as EnergyProtection } from './energy-protection';
import { EnergyCloak as EnergyCloak } from './energy-cloak';
import { EnergyDrain as EnergyDrain } from './energy-drain';
import { Energize as Energize } from './energize';
import { Overload as Overload } from './overload';

export const powerset: Powerset = {
  id: 'brute/energy-aura',
  name: 'Energy Aura',
  description: 'You can surround yourself in powerful defensive Energy Auras that can deflect your foes\' attacks. Like other defensive powers, Energy Auras do not reduce the damage you take, but rather reduce your chance of getting hit by deflecting your foes\' attacks. Energy Auras offer good defense to most attack types, but offer superior defense to Energy based attacks. However, Energy Aura offers no defense to Psionic attacks.',
  icon: 'energy_aura_set.png',
  archetype: 'brute',
  category: 'secondary',
  powers: [
    DampeningField,
    KineticShield,
    PowerShield,
    EntropicAura,
    EnergyProtection,
    EnergyCloak,
    EnergyDrain,
    Energize,
    Overload,
  ],
};

export default powerset;
