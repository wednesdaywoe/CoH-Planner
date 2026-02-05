/**
 * Energy Aura Powerset
 * You can surround yourself in powerful defensive Energy Auras that can deflect your foes' attacks. Like other defensive powers, Energy Auras do not reduce the damage you take, but rather reduce your chance of getting hit by deflecting your foes' attacks. Energy Auras offer good defense to most attack types, but offer superior defense to Energy based attacks. However, Energy Aura offers no defense to Psionic attacks.
 *
 * Archetype: sentinel
 * Category: secondary
 * Source: sentinel_defense/energy_aura
 */

import type { Powerset } from '@/types';

import { KineticDampening as KineticDampening } from './kinetic-dampening';
import { KineticShield as KineticShield } from './kinetic-shield';
import { PowerShield as PowerShield } from './power-shield';
import { Energize as Energize } from './energize';
import { EntropyShield as EntropyShield } from './entropy-shield';
import { PowerArmor as PowerArmor } from './power-armor';
import { RepellingForce as RepellingForce } from './repelling-force';
import { PowerDrain as PowerDrain } from './power-drain';
import { Overload as Overload } from './overload';

export const powerset: Powerset = {
  id: 'sentinel/energy-aura',
  name: 'Energy Aura',
  description: 'You can surround yourself in powerful defensive Energy Auras that can deflect your foes\' attacks. Like other defensive powers, Energy Auras do not reduce the damage you take, but rather reduce your chance of getting hit by deflecting your foes\' attacks. Energy Auras offer good defense to most attack types, but offer superior defense to Energy based attacks. However, Energy Aura offers no defense to Psionic attacks.',
  icon: 'energy_aura_set.png',
  archetype: 'sentinel',
  category: 'secondary',
  powers: [
    KineticDampening,
    KineticShield,
    PowerShield,
    Energize,
    EntropyShield,
    PowerArmor,
    RepellingForce,
    PowerDrain,
    Overload,
  ],
};

export default powerset;
