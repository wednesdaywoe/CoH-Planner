/**
 * Willpower Powerset
 * You aren't Invulnerable. Bullets don't bounce off of you, and if you are cut, you bleed. You are, however, tough, grizzled and strong willed. It takes more than a little cut to keep you down! Willpower offers a strong balance of healing, damage resistance and defense. While you have no real vulnerabilities, you can't quite deal with 'alpha strikes' as well as some other protective powers.
 *
 * Archetype: stalker
 * Category: secondary
 * Source: stalker_defense/willpower
 */

import type { Powerset } from '@/types';

import { Hide as Hide } from './hide';
import { HighPainTolerance as HighPainTolerance } from './high-pain-tolerance';
import { Reconstruction as Reconstruction } from './reconstruction';
import { MindOverBody as MindOverBody } from './mind-over-body';
import { IndomitableWill as IndomitableWill } from './indomitable-will';
import { HeightenedSenses as HeightenedSenses } from './heightened-senses';
import { FastHealing as FastHealing } from './fast-healing';
import { Resurgence as Resurgence } from './resurgence';
import { StrengthofWill as StrengthofWill } from './strength-of-will';

export const powerset: Powerset = {
  id: 'stalker/willpower',
  name: 'Willpower',
  description: 'You aren\'t Invulnerable. Bullets don\'t bounce off of you, and if you are cut, you bleed. You are, however, tough, grizzled and strong willed. It takes more than a little cut to keep you down! Willpower offers a strong balance of healing, damage resistance and defense. While you have no real vulnerabilities, you can\'t quite deal with \'alpha strikes\' as well as some other protective powers.',
  icon: 'willpower_set.png',
  archetype: 'stalker',
  category: 'secondary',
  powers: [
    Hide,
    HighPainTolerance,
    Reconstruction,
    MindOverBody,
    IndomitableWill,
    HeightenedSenses,
    FastHealing,
    Resurgence,
    StrengthofWill,
  ],
};

export default powerset;
