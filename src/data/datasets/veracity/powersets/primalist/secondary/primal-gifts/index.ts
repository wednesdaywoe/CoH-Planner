/**
 * Primal Gifts Powerset
 * Primalists have imbued themselves with the raw power of nature. They can use this energy to aid allies, weaken foes as well as being able to shield themselves from harm.
 *
 * Archetype: primalist
 * Category: secondary
 * Source: primal_gifts/primal_gift
 */

import type { Powerset } from '@/types';

import { PackMaster as PackMaster } from './pack-master';
import { ThickHide as ThickHide } from './thick-hide';
import { Rejuvenate as Rejuvenate } from './rejuvenate';
import { PrimalWard as PrimalWard } from './primal-ward';
import { NaturesBoon as NaturesBoon } from './natures-boon';
import { PrimalHowl as PrimalHowl } from './primal-howl';
import { PrimalistsCloak as PrimalistsCloak } from './primalists-cloak';
import { Inexhaustible as Inexhaustible } from './inexhaustible';
import { WildRoar as WildRoar } from './wild-roar';
import { ShiftersShield as ShiftersShield } from './shifters-shield';
import { GraceofNature as GraceofNature } from './grace-of-nature';
import { WilloftheWild as WilloftheWild } from './will-of-the-wild';

export const powerset: Powerset = {
  id: 'primalist/primal-gifts',
  name: 'Primal Gifts',
  description: 'Primalists have imbued themselves with the raw power of nature. They can use this energy to aid allies, weaken foes as well as being able to shield themselves from harm.',
  icon: 'primal_gift_set.ico',
  archetype: 'primalist',
  category: 'secondary',
  powers: [
    PackMaster,
    ThickHide,
    Rejuvenate,
    PrimalWard,
    NaturesBoon,
    PrimalHowl,
    PrimalistsCloak,
    Inexhaustible,
    WildRoar,
    ShiftersShield,
    GraceofNature,
    WilloftheWild,
  ],
};

export default powerset;
