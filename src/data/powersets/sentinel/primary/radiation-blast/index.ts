/**
 * Radiation Blast Powerset
 * Blast your foes with lethal radiation. Radiation Blast powers can bypass normal defenses, and lower your targets' overall Defense.
 *
 * Archetype: sentinel
 * Category: primary
 * Source: sentinel_ranged/radiation_blast
 */

import type { Powerset } from '@/types';

import { Aim as Aim } from './aim';
import { AtomicBlast as AtomicBlast } from './atomic-blast';
import { CosmicBurst as CosmicBurst } from './cosmic-burst';
import { ElectronHaze as ElectronHaze } from './electron-haze';
import { Irradiate as Irradiate } from './irradiate';
import { NeutrinoBolt as NeutrinoBolt } from './neutrino-bolt';
import { NeutronBomb as NeutronBomb } from './neutron-bomb';
import { ProtonStream as ProtonStream } from './proton-stream';
import { XRayBeam as XRayBeam } from './x-ray-beam';

export const powerset: Powerset = {
  id: 'sentinel/radiation-blast',
  name: 'Radiation Blast',
  description: 'Blast your foes with lethal radiation. Radiation Blast powers can bypass normal defenses, and lower your targets\' overall Defense.',
  icon: 'radiation_blast_set.ico',
  archetype: 'sentinel',
  category: 'primary',
  powers: [
    Aim,
    AtomicBlast,
    CosmicBurst,
    ElectronHaze,
    Irradiate,
    NeutrinoBolt,
    NeutronBomb,
    ProtonStream,
    XRayBeam,
  ],
};

export default powerset;
