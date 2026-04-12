/**
 * Wind Control Powerset
 * Through manipulation of pressure, you are able to channel the force of wind to bind, weaken and crush your opponents.
 *
 * Archetype: controller
 * Category: primary
 * Source: controller_control/wind_control
 */

import type { Powerset } from '@/types';

import { Updraft as Updraft } from './updraft';
import { Downdraft as Downdraft } from './downdraft';
import { Breathless as Breathless } from './breathless';
import { WindShear as WindShear } from './wind-shear';
import { Thundergust as Thundergust } from './thundergust';
import { Microburst as Microburst } from './microburst';
import { KeeningWinds as KeeningWinds } from './keening-winds';
import { Vacuum as Vacuum } from './vacuum';
import { Vortex as Vortex } from './vortex';
import { ClearSkies as ClearSkies } from './clear-skies';

export const powerset: Powerset = {
  id: 'controller/wind-control',
  name: 'Wind Control',
  description: 'Through manipulation of pressure, you are able to channel the force of wind to bind, weaken and crush your opponents.',
  icon: 'wind_control_set.png',
  archetype: 'controller',
  category: 'primary',
  powers: [
    Updraft,
    Downdraft,
    Breathless,
    WindShear,
    Thundergust,
    Microburst,
    KeeningWinds,
    Vacuum,
    Vortex,
    ClearSkies,
  ],
};

export default powerset;
