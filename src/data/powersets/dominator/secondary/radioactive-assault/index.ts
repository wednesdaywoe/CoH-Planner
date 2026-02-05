/**
 * Radioactive Assault Powerset
 * You are able to harness the power of Radiation to crush your foes at range and in close quarters. Radioactive Assault attacks have a chance to inflict the Contaminated state on a target for a moderate amount of time. Powers that deal greater damage, have a longer recharge time and animation time have a greater chance to inflict Contaminated. Hitting Contaminated targets with Neutrino Bolt, Contaminated Strike, Radiation Siphon, X-Ray Beam, Proton Volley and Devastating Blow cause a portion of that power's damage to also hit nearby foes. Radiation Assault attacks primarily deal smashing and energy damage, but this set is also capable of dealing some toxic damage.
 *
 * Archetype: dominator
 * Category: secondary
 * Source: dominator_assault/radioactive_assault
 */

import type { Powerset } from '@/types';

import { ContaminatedStrike as ContaminatedStrike } from './contaminated-strike';
import { NeutrinoBolt as NeutrinoBolt } from './neutrino-bolt';
import { XRayBeam as XRayBeam } from './x-ray-beam';
import { ElectronHaze as ElectronHaze } from './electron-haze';
import { Fusion as Fusion } from './fusion';
import { RadiationSiphon as RadiationSiphon } from './radiation-siphon';
import { AtomSmasher as AtomSmasher } from './atom-smasher';
import { ProtonVolley as ProtonVolley } from './proton-volley';
import { DevastatingBlow as DevastatingBlow } from './devastating-blow';

export const powerset: Powerset = {
  id: 'dominator/radioactive-assault',
  name: 'Radioactive Assault',
  description: 'You are able to harness the power of Radiation to crush your foes at range and in close quarters. Radioactive Assault attacks have a chance to inflict the Contaminated state on a target for a moderate amount of time. Powers that deal greater damage, have a longer recharge time and animation time have a greater chance to inflict Contaminated. Hitting Contaminated targets with Neutrino Bolt, Contaminated Strike, Radiation Siphon, X-Ray Beam, Proton Volley and Devastating Blow cause a portion of that power\'s damage to also hit nearby foes. Radiation Assault attacks primarily deal smashing and energy damage, but this set is also capable of dealing some toxic damage.',
  icon: 'radioactive_assault_set.png',
  archetype: 'dominator',
  category: 'secondary',
  powers: [
    ContaminatedStrike,
    NeutrinoBolt,
    XRayBeam,
    ElectronHaze,
    Fusion,
    RadiationSiphon,
    AtomSmasher,
    ProtonVolley,
    DevastatingBlow,
  ],
};

export default powerset;
