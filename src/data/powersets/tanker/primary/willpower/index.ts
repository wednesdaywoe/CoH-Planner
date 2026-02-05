/**
 * Willpower Powerset
 * You aren't Invulnerable. Bullets don't bounce off of you, and if you are cut, you bleed. You are, however, tough, grizzled and strong willed. It takes more than a little cut to keep you down! Willpower offers a strong balance of healing, damage resistance and defense. While you have no real vulnerabilities, you can't quite deal with 'alpha strikes' as well as some other protective powers.
 *
 * Archetype: tanker
 * Category: primary
 * Source: tanker_defense/willpower
 */

import type { Powerset } from '@/types';

import { HighPainTolerance as HighPainTolerance } from './high-pain-tolerance';
import { MindOverBody as MindOverBody } from './mind-over-body';
import { FastHealing as FastHealing } from './fast-healing';
import { IndomitableWill as IndomitableWill } from './indomitable-will';
import { RisetotheChallenge as RisetotheChallenge } from './rise-to-the-challenge';
import { QuickRecovery as QuickRecovery } from './quick-recovery';
import { HeightenedSenses as HeightenedSenses } from './heightened-senses';
import { Resurgence as Resurgence } from './resurgence';
import { StrengthofWill as StrengthofWill } from './strength-of-will';

export const powerset: Powerset = {
  id: 'tanker/willpower',
  name: 'Willpower',
  description: 'You aren\'t Invulnerable. Bullets don\'t bounce off of you, and if you are cut, you bleed. You are, however, tough, grizzled and strong willed. It takes more than a little cut to keep you down! Willpower offers a strong balance of healing, damage resistance and defense. While you have no real vulnerabilities, you can\'t quite deal with \'alpha strikes\' as well as some other protective powers.',
  icon: 'willpower_set.png',
  archetype: 'tanker',
  category: 'primary',
  powers: [
    HighPainTolerance,
    MindOverBody,
    FastHealing,
    IndomitableWill,
    RisetotheChallenge,
    QuickRecovery,
    HeightenedSenses,
    Resurgence,
    StrengthofWill,
  ],
};

export default powerset;
