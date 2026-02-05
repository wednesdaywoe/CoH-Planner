/**
 * Time Manipulation Powerset
 * By gazing into the flow of time you are able to manipulate time itself. Time Manipulation allows the wielder to inflict crippling debuffs, buff and heal allies and also be able to empower effects on single targets through careful use of Time Crawl and Temporal Selection.
 *
 * Archetype: mastermind
 * Category: secondary
 * Source: mastermind_buff/time_manipulation
 */

import type { Powerset } from '@/types';

import { TemporalMending as TemporalMending } from './temporal-mending';
import { TimeCrawl as TimeCrawl } from './time-crawl';
import { TimesJuncture as TimesJuncture } from './time-s-juncture';
import { TemporalSelection as TemporalSelection } from './temporal-selection';
import { DistortionField as DistortionField } from './distortion-field';
import { TimeStop as TimeStop } from './time-stop';
import { Farsight as Farsight } from './farsight';
import { SlowedResponse as SlowedResponse } from './slowed-response';
import { ChronoShift as ChronoShift } from './chrono-shift';

export const powerset: Powerset = {
  id: 'mastermind/time-manipulation',
  name: 'Time Manipulation',
  description: 'By gazing into the flow of time you are able to manipulate time itself. Time Manipulation allows the wielder to inflict crippling debuffs, buff and heal allies and also be able to empower effects on single targets through careful use of Time Crawl and Temporal Selection.',
  icon: 'time_manipulation_set.png',
  archetype: 'mastermind',
  category: 'secondary',
  powers: [
    TemporalMending,
    TimeCrawl,
    TimesJuncture,
    TemporalSelection,
    DistortionField,
    TimeStop,
    Farsight,
    SlowedResponse,
    ChronoShift,
  ],
};

export default powerset;
