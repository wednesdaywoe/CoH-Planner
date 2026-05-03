/**
 * Fiery Composition Powerset
 * Focusing heat and flame lets those armed with Fiery Composition protect themselves and their allies from harm while also weakening their enemies.
 *
 * Archetype: guardian
 * Category: secondary
 * Source: guardian_comp/fiery_composition
 */

import type { Powerset } from '@/types';

import { FireShield as FireShield } from './fire-shield';
import { SoothingFlames as SoothingFlames } from './soothing-flames';
import { TemperatureProtection as TemperatureProtection } from './temperature-protection';
import { PlasmaShield as PlasmaShield } from './plasma-shield';
import { Consume as Consume } from './consume';
import { Reforge as Reforge } from './reforge';
import { HeatExhaustion as HeatExhaustion } from './heat-exhaustion';
import { MeltArmor as MeltArmor } from './melt-armor';
import { PhoenixAwakening as PhoenixAwakening } from './phoenix-awakening';

export const powerset: Powerset = {
  id: 'guardian/fiery-composition',
  name: 'Fiery Composition',
  description: 'Focusing heat and flame lets those armed with Fiery Composition protect themselves and their allies from harm while also weakening their enemies.',
  icon: 'fiery_aura_set.ico',
  archetype: 'guardian',
  category: 'secondary',
  powers: [
    FireShield,
    SoothingFlames,
    TemperatureProtection,
    PlasmaShield,
    Consume,
    Reforge,
    HeatExhaustion,
    MeltArmor,
    PhoenixAwakening,
  ],
};

export default powerset;
