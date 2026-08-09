/**
 * Temporal Manipulation Powerset
 * By gazing into the flow of time you are able to manipulate time itself. Time Manipulation allows the wielder to inflict crippling debuffs, accelerating yourself, and exhaust your foes by showing them their doomed future.
 *
 * Archetype: blaster
 * Category: secondary
 * Source: blaster_support/time_manipulation
 */

import type { Powerset } from '@/types';

import { TimeWall as TimeWall } from './time-wall';
import { AgingTouch as AgingTouch } from './aging-touch';
import { EndofTime as EndofTime } from './end-of-time';
import { ChronologicalSelection as ChronologicalSelection } from './chronological-selection';
import { TimeStop as TimeStop } from './time-stop';
import { TemporalHealing as TemporalHealing } from './temporal-healing';
import { FuturePain as FuturePain } from './future-pain';
import { BoostRange as BoostRange } from './boost-range';
import { TimeLord as TimeLord } from './time-lord';

export const powerset: Powerset = {
  id: 'blaster/temporal-manipulation',
  internalName: 'time_manipulation',
  name: 'Temporal Manipulation',
  description: 'By gazing into the flow of time you are able to manipulate time itself. Time Manipulation allows the wielder to inflict crippling debuffs, accelerating yourself, and exhaust your foes by showing them their doomed future.',
  icon: 'time_manipulation_set.ico',
  archetype: 'blaster',
  category: 'secondary',
  powers: [
    TimeWall,
    AgingTouch,
    EndofTime,
    ChronologicalSelection,
    TimeStop,
    TemporalHealing,
    FuturePain,
    BoostRange,
    TimeLord,
  ],
};

export default powerset;
