/**
 * Wind Control Powerset
 * Through manipulation of pressure, you are able to channel the force of wind to bind, weaken and crush your opponents.
 *
 * Archetype: dominator
 * Category: primary
 * Source: dominator_control/wind_control
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
import { ClearSkiesText as ClearSkiesText } from './clear-skies-text';

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
    ClearSkiesText,
  ],
};

export default powerset;
