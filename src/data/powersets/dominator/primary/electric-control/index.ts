/**
 * Electric Control Powerset
 * Electricity leaps and sparks at your command. You can use raw electrical power to paralyze, knockdown and drain the endurance of foes.
 *
 * Archetype: dominator
 * Category: primary
 * Source: dominator_control/electric_control
 */

import type { Powerset } from '@/types';

import { ElectricFence as ElectricFence } from './electric-fence';
import { TeslaCage as TeslaCage } from './tesla-cage';
import { ChainFences as ChainFences } from './chain-fences';
import { JoltingChain as JoltingChain } from './jolting-chain';
import { ConductiveAura as ConductiveAura } from './conductive-aura';
import { StaticField as StaticField } from './static-field';
import { TeslaCoil as TeslaCoil } from './tesla-coil';
import { SynapticOverload as SynapticOverload } from './synaptic-overload';
import { Gremlins as Gremlins } from './gremlins';

export const powerset: Powerset = {
  id: 'dominator/electric-control',
  name: 'Electric Control',
  description: 'Electricity leaps and sparks at your command. You can use raw electrical power to paralyze, knockdown and drain the endurance of foes.',
  icon: 'electric_control_set.png',
  archetype: 'dominator',
  category: 'primary',
  powers: [
    ElectricFence,
    TeslaCage,
    ChainFences,
    JoltingChain,
    ConductiveAura,
    StaticField,
    TeslaCoil,
    SynapticOverload,
    Gremlins,
  ],
};

export default powerset;
