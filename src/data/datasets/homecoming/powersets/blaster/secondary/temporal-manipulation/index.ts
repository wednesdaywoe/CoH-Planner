/**
 * Temporal Manipulation Powerset
 * By gazing into the flow of time you are able to manipulate time itself. Temporal Manipulation allows the wielder to inflict crippling debuffs, and cause mental damage and exhausting your foes by showing them their future and accelerating their aging.
 *
 * Archetype: blaster
 * Category: secondary
 * Source: blaster_support/time_manipulation
 */

import type { Powerset } from '@/types';

import { TimeWall as TimeWall } from './time-wall';
import { AgingTouch as AgingTouch } from './aging-touch';
import { TimeStop as TimeStop } from './time-stop';
import { ChronologicalSelection as ChronologicalSelection } from './chronological-selection';
import { EndofTime as EndofTime } from './end-of-time';
import { TemporalHealing as TemporalHealing } from './temporal-healing';
import { FuturePain as FuturePain } from './future-pain';
import { TimeShift as TimeShift } from './time-shift';
import { TimeLord as TimeLord } from './time-lord';

export const powerset: Powerset = {
  id: 'blaster/temporal-manipulation',
  setPath: 'Blaster_Support.Time_Manipulation',
  name: 'Temporal Manipulation',
  buyRequires: [],
  buyRequiresFailed: "",
  specializeAt: 0,
  specializeRequires: [],
  description: 'By gazing into the flow of time you are able to manipulate time itself. Temporal Manipulation allows the wielder to inflict crippling debuffs, and cause mental damage and exhausting your foes by showing them their future and accelerating their aging.',
  icon: 'time_manipulation_set.ico',
  archetype: 'blaster',
  category: 'secondary',
  powers: [
    TimeWall,
    AgingTouch,
    TimeStop,
    ChronologicalSelection,
    EndofTime,
    TemporalHealing,
    FuturePain,
    TimeShift,
    TimeLord,
  ],
};

export default powerset;
