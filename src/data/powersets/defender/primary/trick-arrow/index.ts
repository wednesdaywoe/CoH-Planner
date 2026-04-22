/**
 * Trick Arrow Powerset
 * Trick Arrows are tipped with an odd variety of payloads, which if used strategically, can dramatically alter a battle site.
 *
 * Archetype: defender
 * Category: primary
 * Source: defender_buff/trick_arrow
 */

import type { Powerset } from '@/types';

import { AcidArrow as AcidArrow } from './acid-arrow';
import { DisruptionArrow as DisruptionArrow } from './disruption-arrow';
import { EMPArrow as EMPArrow } from './emp-arrow';
import { EntanglingArrow as EntanglingArrow } from './entangling-arrow';
import { FlashArrow as FlashArrow } from './flash-arrow';
import { GlueArrow as GlueArrow } from './glue-arrow';
import { IceArrow as IceArrow } from './ice-arrow';
import { OilSlickArrow as OilSlickArrow } from './oil-slick-arrow';
import { PoisonGasArrow as PoisonGasArrow } from './poison-gas-arrow';

export const powerset: Powerset = {
  id: 'defender/trick-arrow',
  name: 'Trick Arrow',
  description: 'Trick Arrows are tipped with an odd variety of payloads, which if used strategically, can dramatically alter a battle site.',
  icon: 'trick_arrow_set.ico',
  archetype: 'defender',
  category: 'primary',
  powers: [
    AcidArrow,
    DisruptionArrow,
    EMPArrow,
    EntanglingArrow,
    FlashArrow,
    GlueArrow,
    IceArrow,
    OilSlickArrow,
    PoisonGasArrow,
  ],
};

export default powerset;
