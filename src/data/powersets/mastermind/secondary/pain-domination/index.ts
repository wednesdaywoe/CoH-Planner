/**
 * Pain Domination Powerset
 * Pain Domination gives a character the ability to manipulate, nullify and amplify pain. Ultimately this grants the user powerful healing, buffing and debuffing powers. It's healing output is unmatched!
 *
 * Archetype: mastermind
 * Category: secondary
 * Source: mastermind_buff/pain_domination
 */

import type { Powerset } from '@/types';

import { AnguishingCry as AnguishingCry } from './anguishing-cry';
import { ConduitofPain as ConduitofPain } from './conduit-of-pain';
import { EnforcedMorale as EnforcedMorale } from './enforced-morale';
import { NullifyPain as NullifyPain } from './nullify-pain';
import { Painbringer as Painbringer } from './painbringer';
import { SharePain as SharePain } from './share-pain';
import { Soothe as Soothe } from './soothe';
import { SuppressPain as SuppressPain } from './soothing-aura';
import { WorldofPain as WorldofPain } from './world-of-pain';

export const powerset: Powerset = {
  id: 'mastermind/pain-domination',
  name: 'Pain Domination',
  description: 'Pain Domination gives a character the ability to manipulate, nullify and amplify pain. Ultimately this grants the user powerful healing, buffing and debuffing powers. It\'s healing output is unmatched!',
  icon: 'pain_domination_set.ico',
  archetype: 'mastermind',
  category: 'secondary',
  powers: [
    AnguishingCry,
    ConduitofPain,
    EnforcedMorale,
    NullifyPain,
    Painbringer,
    SharePain,
    Soothe,
    SuppressPain,
    WorldofPain,
  ],
};

export default powerset;
