/**
 * Energy Aura Powerset
 * You can surround yourself in powerful defensive Energy Auras that can deflect your foes' attacks. Like other defensive powers, Energy Auras do not reduce the damage you take, but rather reduce your chance of getting hit by deflecting your foes' attacks. Energy Auras offer good defense to most attack types, but offer superior defense to Energy based attacks. However, Energy Aura offers no defense to Psionic attacks.
 *
 * Archetype: scrapper
 * Category: secondary
 * Source: scrapper_defense/energy_aura
 */

import type { Powerset } from '@/types';

import { DampeningField as DampeningField } from './dampening-field';
import { KineticShield as KineticShield } from './kinetic-shield';
import { PowerShield as PowerShield } from './power-shield';
import { EntropicAura as EntropicAura } from './entropic-aura';
import { EnergyProtection as EnergyProtection } from './energy-protection';
import { EnergyCloak as EnergyCloak } from './energy-cloak';
import { Energize as Energize } from './energize';
import { EnergyDrain as EnergyDrain } from './energy-drain';
import { Overload as Overload } from './overload';

export const powerset: Powerset = {
  id: 'scrapper/energy-aura',
  name: 'Energy Aura',
  description: 'You can surround yourself in powerful defensive Energy Auras that can deflect your foes\' attacks. Like other defensive powers, Energy Auras do not reduce the damage you take, but rather reduce your chance of getting hit by deflecting your foes\' attacks. Energy Auras offer good defense to most attack types, but offer superior defense to Energy based attacks. However, Energy Aura offers no defense to Psionic attacks.',
  icon: 'energy_aura_set.png',
  archetype: 'scrapper',
  category: 'secondary',
  powers: [
    DampeningField,
    KineticShield,
    PowerShield,
    EntropicAura,
    EnergyProtection,
    EnergyCloak,
    Energize,
    EnergyDrain,
    Overload,
  ],
};

export default powerset;
