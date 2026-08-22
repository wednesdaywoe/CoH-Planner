/**
 * Tactical Arrow Powerset
 * Gain an advantage in combat with a combination of training techniques that boost your accuracy and movement skills in addition to Tactical Arrows tipped with a variety of payloads, which if used strategically, can dramatically alter a battle site.
 *
 * Archetype: blaster
 * Category: secondary
 * Source: blaster_support/tactical_arrow
 */

import type { Powerset } from '@/types';

import { ElectrifiedNetArrow as ElectrifiedNetArrow } from './electrified-net-arrow';
import { GlueArrow as GlueArrow } from './glue-arrow';
import { IceArrow as IceArrow } from './ice-arrow';
import { Upshot as Upshot } from './upshot';
import { FlashArrow as FlashArrow } from './flash-arrow';
import { EagleEye as EagleEye } from './eagle-eye';
import { Quickness as Quickness } from './quickness';
import { EMPArrow as EMPArrow } from './emp-arrow';
import { Gymnastics as Gymnastics } from './gymnastics';

export const powerset: Powerset = {
  id: 'blaster/tactical-arrow',
  setPath: 'Blaster_Support.Tactical_Arrow',
  name: 'Tactical Arrow',
  buyRequires: [],
  buyRequiresFailed: "",
  specializeAt: 0,
  specializeRequires: [],
  description: "Gain an advantage in combat with a combination of training techniques that boost your accuracy and movement skills in addition to Tactical Arrows tipped with a variety of payloads, which if used strategically, can dramatically alter a battle site.",
  icon: 'tactical_arrow_set.ico',
  archetype: 'blaster',
  category: 'secondary',
  powers: [
    ElectrifiedNetArrow,
    GlueArrow,
    IceArrow,
    Upshot,
    FlashArrow,
    EagleEye,
    Quickness,
    EMPArrow,
    Gymnastics,
  ],
};

export default powerset;
