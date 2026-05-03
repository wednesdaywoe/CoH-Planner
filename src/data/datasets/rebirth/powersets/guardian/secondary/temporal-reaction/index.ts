/**
 * Temporal Reaction Powerset
 * With Temporal Reaction you gaze into the flow of time allowing you to react deftly to avoid danger.  Regardless of what comes at you, Temporal Reaction simply allows you to avoid the attack.  Wielders of Temporal Reaction are able to manipulate time itself to inflict crippling debuffs, while buffing and healing allies.
 *
 * Archetype: guardian
 * Category: secondary
 * Source: guardian_comp/temporal_reaction
 */

import type { Powerset } from '@/types';

import { FocusedFighter as FocusedFighter } from './focused-fighter';
import { TimeCrawl as TimeCrawl } from './time-crawl';
import { Agile as Agile } from './agile';
import { PracticedBrawler as PracticedBrawler } from './practiced-brawler';
import { TimesJuncture as TimesJuncture } from './times-juncture';
import { Lucky as Lucky } from './lucky';
import { Farsight as Farsight } from './farsight';
import { SlowedResponse as SlowedResponse } from './slowed-response';
import { ChronoShift as ChronoShift } from './chrono-shift';

export const powerset: Powerset = {
  id: 'guardian/temporal-reaction',
  name: 'Temporal Reaction',
  description: 'With Temporal Reaction you gaze into the flow of time allowing you to react deftly to avoid danger.  Regardless of what comes at you, Temporal Reaction simply allows you to avoid the attack.  Wielders of Temporal Reaction are able to manipulate time itself to inflict crippling debuffs, while buffing and healing allies.',
  icon: 'time_manipulation_set.ico',
  archetype: 'guardian',
  category: 'secondary',
  powers: [
    FocusedFighter,
    TimeCrawl,
    Agile,
    PracticedBrawler,
    TimesJuncture,
    Lucky,
    Farsight,
    SlowedResponse,
    ChronoShift,
  ],
};

export default powerset;
