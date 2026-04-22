/**
 * Radiation Blast Powerset
 * Blast your foes with lethal radiation. Radiation Blast powers can bypass normal defenses, and lower your targets' overall Defense.
 *
 * Archetype: corruptor
 * Category: primary
 * Source: corruptor_ranged/radiation_blast
 */

import type { Powerset } from '@/types';

import { Aim as Aim } from './aim';
import { AtomicBlast as AtomicBlast } from './atomic-blast';
import { CosmicBurst as CosmicBurst } from './cosmic-burst';
import { ElectronHaze as ElectronHaze } from './electron-haze';
import { Irradiate as Irradiate } from './irradiate';
import { NeutrinoBolt as NeutrinoBolt } from './neutrino-bolt';
import { NeutronBomb as NeutronBomb } from './neutron-bomb';
import { ProtonVolley as ProtonVolley } from './proton-volley';
import { XRayBeam as XRayBeam } from './x-ray-beam';

export const powerset: Powerset = {
  id: 'corruptor/radiation-blast',
  name: 'Radiation Blast',
  description: 'Blast your foes with lethal radiation. Radiation Blast powers can bypass normal defenses, and lower your targets\' overall Defense.',
  icon: 'radiation_blast_set.ico',
  archetype: 'corruptor',
  category: 'primary',
  powers: [
    Aim,
    AtomicBlast,
    CosmicBurst,
    ElectronHaze,
    Irradiate,
    NeutrinoBolt,
    NeutronBomb,
    ProtonVolley,
    XRayBeam,
  ],
};

export default powerset;
