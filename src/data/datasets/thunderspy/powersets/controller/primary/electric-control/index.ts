/**
 * Electric Control Powerset
 * Electricity leaps and sparks at your command.  You can use raw electrical power to paralyze, knockdown and drain the endurance of foes.
 *
 * Archetype: controller
 * Category: primary
 * Source: controller_control/electric_control
 */

import type { Powerset } from '@/types';

import { Gremlins as Gremlins } from './gremlins';
import { TeslaCage as TeslaCage } from './tesla-cage';
import { ChainFences as ChainFences } from './chain-fences';
import { JoltingChain as JoltingChain } from './jolting-chain';
import { StunningAura as StunningAura } from './stunning-aura';
import { SynapticOverload as SynapticOverload } from './synaptic-overload';
import { StaticField as StaticField } from './static-field';
import { ElectricFence as ElectricFence } from './electric-fence';
import { ParalyzingBlast as ParalyzingBlast } from './paralyzing-blast';

export const powerset: Powerset = {
  id: 'controller/electric-control',
  setPath: 'Controller_Control.Electric_Control',
  name: 'Electric Control',
  buyRequires: [],
  buyRequiresFailed: "",
  specializeAt: 0,
  specializeRequires: [],
  description: 'Electricity leaps and sparks at your command.  You can use raw electrical power to paralyze, knockdown and drain the endurance of foes.',
  icon: 'electric_control_set.ico',
  archetype: 'controller',
  category: 'primary',
  powers: [
    Gremlins,
    TeslaCage,
    ChainFences,
    JoltingChain,
    StunningAura,
    SynapticOverload,
    StaticField,
    ElectricFence,
    ParalyzingBlast,
  ],
};

export default powerset;
