/**
 * Martial Combat Powerset
 * Your mastery of Martial Combat allows you to draw on the physical energy stored within your body to perform remarkable feats. You deliver damage to your enemies via withering kicks and punches, while your preternatural senses keep you moving faster and striking harder than any who oppose you.
 *
 * Archetype: blaster
 * Category: secondary
 * Source: blaster_support/martial_manipulation
 */

import type { Powerset } from '@/types';

import { ReachfortheLimit as ReachfortheLimit } from './build-up-proc';
import { BurstofSpeed as BurstofSpeed } from './burst-of-speed';
import { DragonsTail as DragonsTail } from './dragons-tail';
import { EaglesClaw as EaglesClaw } from './eagles-claw';
import { InnerWill as InnerWill } from './inner-will';
import { KiPush as KiPush } from './ki-push';
import { ReachfortheLimit as ReachfortheLimit2 } from './reach-for-the-limit';
import { ReactionTime as ReactionTime } from './reaction-time';
import { StormKick as StormKick } from './storm-kick';
import { ThrowSand as ThrowSand } from './throw-sand';

export const powerset: Powerset = {
  id: 'blaster/martial-combat',
  name: 'Martial Combat',
  description: 'Your mastery of Martial Combat allows you to draw on the physical energy stored within your body to perform remarkable feats. You deliver damage to your enemies via withering kicks and punches, while your preternatural senses keep you moving faster and striking harder than any who oppose you.',
  icon: 'martial_manipulation_set.ico',
  archetype: 'blaster',
  category: 'secondary',
  powers: [
    ReachfortheLimit,
    BurstofSpeed,
    DragonsTail,
    EaglesClaw,
    InnerWill,
    KiPush,
    ReachfortheLimit2,
    ReactionTime,
    StormKick,
    ThrowSand,
  ],
};

export default powerset;
