/**
 * Trick Arrow Powerset
 * Trick Arrows are tipped with an odd variety of payloads, which if used strategically, can dramatically alter a battle site.
 *
 * Archetype: controller
 * Category: secondary
 * Source: controller_buff/trick_arrow
 */

import type { Powerset } from '@/types';

import { EntanglingArrow as EntanglingArrow } from './entangling-arrow';
import { FlashArrow as FlashArrow } from './flash-arrow';
import { GlueArrow as GlueArrow } from './glue-arrow';
import { IceArrow as IceArrow } from './ice-arrow';
import { PoisonGasArrow as PoisonGasArrow } from './poison-gas-arrow';
import { AcidArrow as AcidArrow } from './acid-arrow';
import { DisruptionArrow as DisruptionArrow } from './disruption-arrow';
import { OilSlickArrow as OilSlickArrow } from './oil-slick-arrow';
import { EMPArrow as EMPArrow } from './emp-arrow';

export const powerset: Powerset = {
  id: 'controller/trick-arrow',
  name: 'Trick Arrow',
  description: 'Trick Arrows are tipped with an odd variety of payloads, which if used strategically, can dramatically alter a battle site.',
  icon: 'trick_arrow_set.png',
  archetype: 'controller',
  category: 'secondary',
  powers: [
    EntanglingArrow,
    FlashArrow,
    GlueArrow,
    IceArrow,
    PoisonGasArrow,
    AcidArrow,
    DisruptionArrow,
    OilSlickArrow,
    EMPArrow,
  ],
};

export default powerset;
