/**
 * Tactical Arrow Powerset
 * Gain an advantage in combat with a combination of training techniques that boost your accuracy and movement skills in addition to Tactical Arrows tipped with a variety of payloads, which if used strategically, can dramatically alter a battle site.
 *
 * Archetype: blaster
 * Category: secondary
 * Source: blaster_support/tactical_arrow
 */

import type { Powerset } from '@/types';

import { EagleEye as EagleEye } from './eagle-eye';
import { ElectrifiedNetArrow as ElectrifiedNetArrow } from './electrified-net-arrow';
import { ESDArrow as ESDArrow } from './emp-arrow';
import { FlashArrow as FlashArrow } from './flash-arrow';
import { GlueArrow as GlueArrow } from './glue-arrow';
import { OilSlickArrow as OilSlickArrow } from './gymnastics';
import { IceArrow as IceArrow } from './ice-arrow';
import { Gymnastics as Gymnastics } from './quickness';
import { Upshot as Upshot } from './upshot';

export const powerset: Powerset = {
  id: 'blaster/tactical-arrow',
  name: 'Tactical Arrow',
  description: 'Gain an advantage in combat with a combination of training techniques that boost your accuracy and movement skills in addition to Tactical Arrows tipped with a variety of payloads, which if used strategically, can dramatically alter a battle site.',
  icon: 'tactical_arrow_set.ico',
  archetype: 'blaster',
  category: 'secondary',
  powers: [
    EagleEye,
    ElectrifiedNetArrow,
    ESDArrow,
    FlashArrow,
    GlueArrow,
    OilSlickArrow,
    IceArrow,
    Gymnastics,
    Upshot,
  ],
};

export default powerset;
