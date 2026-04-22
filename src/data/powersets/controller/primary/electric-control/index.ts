/**
 * Electric Control Powerset
 * Electricity leaps and sparks at your command. You can use raw electrical power to paralyze, knockdown and drain the endurance of foes.
 *
 * Archetype: controller
 * Category: primary
 * Source: controller_control/electric_control
 */

import type { Powerset } from '@/types';

import { ChainFences as ChainFences } from './chain-fences';
import { ElectricFence as ElectricFence } from './electric-fence';
import { Gremlins as Gremlins } from './gremlins';
import { JoltingChain as JoltingChain } from './jolting-chain';
import { TeslaCoil as TeslaCoil } from './paralyzing-blast';
import { StaticField as StaticField } from './static-field';
import { ConductiveAura as ConductiveAura } from './stunning-aura';
import { SynapticOverload as SynapticOverload } from './synaptic-overload';
import { TeslaCage as TeslaCage } from './tesla-cage';

export const powerset: Powerset = {
  id: 'controller/electric-control',
  name: 'Electric Control',
  description: 'Electricity leaps and sparks at your command. You can use raw electrical power to paralyze, knockdown and drain the endurance of foes.',
  icon: 'electric_control_set.ico',
  archetype: 'controller',
  category: 'primary',
  powers: [
    ChainFences,
    ElectricFence,
    Gremlins,
    JoltingChain,
    TeslaCoil,
    StaticField,
    ConductiveAura,
    SynapticOverload,
    TeslaCage,
  ],
};

export default powerset;
