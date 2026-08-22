/**
 * Radiation Blast Powerset
 * Blast your foes with lethal radiation. Radiation Blast powers can lower your targets' overall Defense. Radiation Blast attacks have a chance to inflict the Contaminated state on a target for a moderate amount of time. Powers that deal greater damage, have a longer recharge time and animation time have a greater chance to inflict Contaminated. Hitting Contaminated targets with Neutrino Bolt, X-Ray Beam, Proton Volley and Cosmic Burst cause a portion of that power's damage to also hit nearby foes.
 *
 * Archetype: blaster
 * Category: primary
 * Source: blaster_ranged/radiation_blast
 */

import type { Powerset } from '@/types';

import { NeutrinoBolt as NeutrinoBolt } from './neutrino-bolt';
import { XRayBeam as XRayBeam } from './x-ray-beam';
import { ElectronHaze as ElectronHaze } from './electron-haze';
import { Irradiate as Irradiate } from './irradiate';
import { CosmicBurst as CosmicBurst } from './cosmic-burst';
import { NeutronBomb as NeutronBomb } from './neutron-bomb';
import { Aim as Aim } from './aim';
import { ProtonVolley as ProtonVolley } from './proton-volley';
import { AtomicBlast as AtomicBlast } from './atomic-blast';

export const powerset: Powerset = {
  id: 'blaster/radiation-blast',
  setPath: 'Blaster_Ranged.Radiation_Blast',
  name: 'Radiation Blast',
  buyRequires: [],
  buyRequiresFailed: "",
  specializeAt: 0,
  specializeRequires: [],
  description: "Blast your foes with lethal radiation. Radiation Blast powers can lower your targets' overall Defense. Radiation Blast attacks have a chance to inflict the Contaminated state on a target for a moderate amount of time. Powers that deal greater damage, have a longer recharge time and animation time have a greater chance to inflict Contaminated. Hitting Contaminated targets with Neutrino Bolt, X-Ray Beam, Proton Volley and Cosmic Burst cause a portion of that power's damage to also hit nearby foes.",
  icon: 'radiation_blast_set.ico',
  archetype: 'blaster',
  category: 'primary',
  powers: [
    NeutrinoBolt,
    XRayBeam,
    ElectronHaze,
    Irradiate,
    CosmicBurst,
    NeutronBomb,
    Aim,
    ProtonVolley,
    AtomicBlast,
  ],
};

export default powerset;
