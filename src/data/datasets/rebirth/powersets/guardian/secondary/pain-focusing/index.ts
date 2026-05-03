/**
 * Pain Focusing Powerset
 * It takes more than a little pain to keep you down! Pain Focusing uses your willpower to master overwhelming pain. With it, you can channel your pain to protect your allies, yourself, and weaken adversaries.
 *
 * Archetype: guardian
 * Category: secondary
 * Source: guardian_comp/pain_focusing
 */

import type { Powerset } from '@/types';

import { MindOverBody as MindOverBody } from './mind-over-body';
import { NullifyPain as NullifyPain } from './nullify-pain';
import { QuickRecovery as QuickRecovery } from './quick-recovery';
import { IndomitableWill as IndomitableWill } from './indomitable-will';
import { SuppressPain as SuppressPain } from './suppress-pain';
import { HeightenedSenses as HeightenedSenses } from './heightened-senses';
import { ConduitofPain as ConduitofPain } from './conduit-of-pain';
import { AnguishingCry as AnguishingCry } from './anguishing-cry';
import { WorldofPain as WorldofPain } from './world-of-pain';

export const powerset: Powerset = {
  id: 'guardian/pain-focusing',
  name: 'Pain Focusing',
  description: 'It takes more than a little pain to keep you down! Pain Focusing uses your willpower to master overwhelming pain. With it, you can channel your pain to protect your allies, yourself, and weaken adversaries.',
  icon: 'pain_domination_set.ico',
  archetype: 'guardian',
  category: 'secondary',
  powers: [
    MindOverBody,
    NullifyPain,
    QuickRecovery,
    IndomitableWill,
    SuppressPain,
    HeightenedSenses,
    ConduitofPain,
    AnguishingCry,
    WorldofPain,
  ],
};

export default powerset;
