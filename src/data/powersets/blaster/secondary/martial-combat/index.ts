/**
 * Martial Combat Powerset
 * Your mastery of Martial Combat allows you to draw on the physical energy stored within your body to perform remarkable feats. You deliver damage to your enemies via withering kicks and punches, while your preternatural senses keep you moving faster and striking harder than any who oppose you.
 *
 * Archetype: blaster
 * Category: secondary
 * Source: blaster_support/martial_manipulation
 */

import type { Powerset } from '@/types';

import { ReachfortheLimit as ReachfortheLimit } from './reach-for-the-limit';
import { KiPush as KiPush } from './ki-push';
import { StormKick as StormKick } from './storm-kick';
import { ReachfortheLimit as ReachfortheLimit2 } from './reach-for-the-limit';
import { BurstofSpeed as BurstofSpeed } from './burst-of-speed';
import { DragonsTail as DragonsTail } from './dragon-s-tail';
import { ReactionTime as ReactionTime } from './reaction-time';
import { InnerWill as InnerWill } from './inner-will';
import { ThrowSand as ThrowSand } from './throw-sand';
import { EaglesClaw as EaglesClaw } from './eagles-claw';

export const powerset: Powerset = {
  id: 'blaster/martial-combat',
  name: 'Martial Combat',
  description: 'Your mastery of Martial Combat allows you to draw on the physical energy stored within your body to perform remarkable feats. You deliver damage to your enemies via withering kicks and punches, while your preternatural senses keep you moving faster and striking harder than any who oppose you.',
  icon: 'martial_manipulation_set.png',
  archetype: 'blaster',
  category: 'secondary',
  powers: [
    ReachfortheLimit,
    KiPush,
    StormKick,
    ReachfortheLimit2,
    BurstofSpeed,
    DragonsTail,
    ReactionTime,
    InnerWill,
    ThrowSand,
    EaglesClaw,
  ],
};

export default powerset;
