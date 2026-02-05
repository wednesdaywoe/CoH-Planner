/**
 * Willpower Powerset
 * You aren't Invulnerable. Bullets don't bounce off of you, and if you are cut, you bleed. You are, however, tough, grizzled and strong willed. It takes more than a little cut to keep you down! Willpower offers a strong balance of healing, damage resistance and defense. While you have no real vulnerabilities, you can't quite deal with 'alpha strikes' as well as some other protective powers.
 *
 * Archetype: sentinel
 * Category: secondary
 * Source: sentinel_defense/willpower
 */

import type { Powerset } from '@/types';

import { HighPainTolerance as HighPainTolerance } from './high-pain-tolerance';
import { MindOverBody as MindOverBody } from './mind-over-body';
import { FastHealing as FastHealing } from './fast-healing';
import { IndomitableWill as IndomitableWill } from './indomitable-will';
import { UptotheChallenge as UptotheChallenge } from './up-to-the-challenge';
import { QuickRecovery as QuickRecovery } from './quick-recovery';
import { HeightenedSenses as HeightenedSenses } from './heightened-senses';
import { Resurgence as Resurgence } from './resurgence';
import { StrengthofWill as StrengthofWill } from './strength-of-will';

export const powerset: Powerset = {
  id: 'sentinel/willpower',
  name: 'Willpower',
  description: 'You aren\'t Invulnerable. Bullets don\'t bounce off of you, and if you are cut, you bleed. You are, however, tough, grizzled and strong willed. It takes more than a little cut to keep you down! Willpower offers a strong balance of healing, damage resistance and defense. While you have no real vulnerabilities, you can\'t quite deal with \'alpha strikes\' as well as some other protective powers.',
  icon: 'willpower_set.png',
  archetype: 'sentinel',
  category: 'secondary',
  powers: [
    HighPainTolerance,
    MindOverBody,
    FastHealing,
    IndomitableWill,
    UptotheChallenge,
    QuickRecovery,
    HeightenedSenses,
    Resurgence,
    StrengthofWill,
  ],
};

export default powerset;
