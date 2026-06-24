/**
 * Vapor Control Powerset
 * Gas is one of the four most basic forms of matter, and you are able to deploy it to hinder and distract your foes. Vapor Control focuses on indirect control methods such as toggles and pets, and receives special effects when gases are mixed into various formulas.
 *
 * Archetype: dominator
 * Category: primary
 * Source: dominator_control/quovapor_control
 */

import type { Powerset } from '@/types';

import { Condensation as Condensation } from './condensation';
import { Plume as Plume } from './plume';
import { Brine as Brine } from './brine';
import { Haze as Haze } from './haze';
import { VentilationLoop as VentilationLoop } from './ventilationloop';
import { PersonalAtmosphere as PersonalAtmosphere } from './personalatmosphere';
import { ConcussiveMist as ConcussiveMist } from './concussivemist';
import { AerosolCurtain as AerosolCurtain } from './aerosolcurtain';
import { NobleGasses as NobleGasses } from './noblegasses';
import { ReactiveCloud as ReactiveCloud } from './reactivecloud';

export const powerset: Powerset = {
  id: 'dominator/vapor-control',
  name: 'Vapor Control',
  description: 'Gas is one of the four most basic forms of matter, and you are able to deploy it to hinder and distract your foes. Vapor Control focuses on indirect control methods such as toggles and pets, and receives special effects when gases are mixed into various formulas.',
  icon: 'darkness_control_set.ico',
  archetype: 'dominator',
  category: 'primary',
  powers: [
    Condensation,
    Plume,
    Brine,
    Haze,
    VentilationLoop,
    PersonalAtmosphere,
    ConcussiveMist,
    AerosolCurtain,
    NobleGasses,
    ReactiveCloud,
  ],
};

export default powerset;
