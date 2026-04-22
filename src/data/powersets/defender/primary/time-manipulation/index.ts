/**
 * Time Manipulation Powerset
 * By gazing into the flow of time you are able to manipulate time itself. Time Manipulation allows the wielder to inflict crippling debuffs, buff and heal allies and also be able to empower effects on single targets through careful use of Time Crawl and Temporal Selection.
 *
 * Archetype: defender
 * Category: primary
 * Source: defender_buff/time_manipulation
 */

import type { Powerset } from '@/types';

import { ChronoShift as ChronoShift } from './chrono-shift';
import { DistortionField as DistortionField } from './distortion-field';
import { Farsight as Farsight } from './farsight';
import { SlowedResponse as SlowedResponse } from './slowed-response';
import { TemporalMending as TemporalMending } from './temporal-mending';
import { TemporalSelection as TemporalSelection } from './temporal-selection';
import { TimeCrawl as TimeCrawl } from './time-crawl';
import { TimeStop as TimeStop } from './time-stop';
import { TimesJuncture as TimesJuncture } from './times-juncture';

export const powerset: Powerset = {
  id: 'defender/time-manipulation',
  name: 'Time Manipulation',
  description: 'By gazing into the flow of time you are able to manipulate time itself. Time Manipulation allows the wielder to inflict crippling debuffs, buff and heal allies and also be able to empower effects on single targets through careful use of Time Crawl and Temporal Selection.',
  icon: 'time_manipulation_set.ico',
  archetype: 'defender',
  category: 'primary',
  powers: [
    ChronoShift,
    DistortionField,
    Farsight,
    SlowedResponse,
    TemporalMending,
    TemporalSelection,
    TimeCrawl,
    TimeStop,
    TimesJuncture,
  ],
};

export default powerset;
