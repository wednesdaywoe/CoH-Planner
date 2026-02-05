/**
 * Pain Domination Powerset
 * Pain Domination gives a character the ability to manipulate, nullify and amplify pain. Ultimately this grants the user powerful healing, buffing and debuffing powers. It's healing output is unmatched!
 *
 * Archetype: defender
 * Category: primary
 * Source: defender_buff/pain_domination
 */

import type { Powerset } from '@/types';

import { NullifyPain as NullifyPain } from './nullify-pain';
import { Soothe as Soothe } from './soothe';
import { SharePain as SharePain } from './share-pain';
import { ConduitofPain as ConduitofPain } from './conduit-of-pain';
import { EnforcedMorale as EnforcedMorale } from './enforced-morale';
import { SoothingAura as SoothingAura } from './soothing-aura';
import { WorldofPain as WorldofPain } from './world-of-pain';
import { AnguishingCry as AnguishingCry } from './anguishing-cry';
import { Painbringer as Painbringer } from './painbringer';

export const powerset: Powerset = {
  id: 'defender/pain-domination',
  name: 'Pain Domination',
  description: 'Pain Domination gives a character the ability to manipulate, nullify and amplify pain. Ultimately this grants the user powerful healing, buffing and debuffing powers. It\'s healing output is unmatched!',
  icon: 'pain_domination_set.png',
  archetype: 'defender',
  category: 'primary',
  powers: [
    NullifyPain,
    Soothe,
    SharePain,
    ConduitofPain,
    EnforcedMorale,
    SoothingAura,
    WorldofPain,
    AnguishingCry,
    Painbringer,
  ],
};

export default powerset;
