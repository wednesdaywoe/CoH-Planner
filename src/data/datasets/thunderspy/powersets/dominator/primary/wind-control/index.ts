/**
 * Wind Control Powerset
 * Through manipulation of pressure, you are able to channel the force of wind to bind, weaken and crush your opponents.
 *
 * Archetype: dominator
 * Category: primary
 * Source: dominator_control/wind_control
 */

import type { Powerset } from '@/types';

import { Vortex as Vortex } from './vortex';
import { Downdraft as Downdraft } from './downdraft';
import { Breathless as Breathless } from './breathless';
import { Updraft as Updraft } from './updraft';
import { Thundergust as Thundergust } from './thundergust';
import { Microburst as Microburst } from './microburst';
import { WindShear as WindShear } from './wind-shear';
import { KeeningWinds as KeeningWinds } from './keening-winds';
import { Vacuum as Vacuum } from './vacuum';
import { ClearSkies as ClearSkies } from './clear-skies';

export const powerset: Powerset = {
  id: 'dominator/wind-control',
  setPath: 'Dominator_Control.Wind_Control',
  name: 'Wind Control',
  buyRequires: [],
  buyRequiresFailed: "",
  specializeAt: 0,
  specializeRequires: [],
  description: 'Through manipulation of pressure, you are able to channel the force of wind to bind, weaken and crush your opponents.',
  icon: 'wind_control_set.ico',
  archetype: 'dominator',
  category: 'primary',
  powers: [
    Vortex,
    Downdraft,
    Breathless,
    Updraft,
    Thundergust,
    Microburst,
    WindShear,
    KeeningWinds,
    Vacuum,
    ClearSkies,
  ],
};

export default powerset;
