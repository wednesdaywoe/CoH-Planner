/**
 * Pain Domination Powerset
 * Pain Domination gives a character the ability to manipulate, nullify and amplify pain.  Ultimately this grants the user powerful healing, buffing and debuffing powers.  It's healing output is unmatched!
 *
 * Archetype: corruptor
 * Category: secondary
 * Source: corruptor_buff/pain_domination
 */

import type { Powerset } from '@/types';

import { PainMonitor as PainMonitor } from './pain-monitor';
import { NullifyPain as NullifyPain } from './nullify-pain';
import { Soothe as Soothe } from './soothe';
import { SharePain as SharePain } from './share-pain';
import { EnforcedMorale as EnforcedMorale } from './enforced-morale';
import { WorldofPain as WorldofPain } from './world-of-pain';
import { SoothingAura as SoothingAura } from './soothing-aura';
import { AnguishingCry as AnguishingCry } from './anguishing-cry';
import { ConduitofPain as ConduitofPain } from './conduit-of-pain';
import { Painbringer as Painbringer } from './painbringer';

export const powerset: Powerset = {
  id: 'corruptor/pain-domination',
  name: 'Pain Domination',
  description: 'Pain Domination gives a character the ability to manipulate, nullify and amplify pain.  Ultimately this grants the user powerful healing, buffing and debuffing powers.  It\'s healing output is unmatched!',
  icon: 'pain_domination_set.ico',
  archetype: 'corruptor',
  category: 'secondary',
  powers: [
    PainMonitor,
    NullifyPain,
    Soothe,
    SharePain,
    EnforcedMorale,
    WorldofPain,
    SoothingAura,
    AnguishingCry,
    ConduitofPain,
    Painbringer,
  ],
};

export default powerset;
