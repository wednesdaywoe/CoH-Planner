/**
 * Martial Assault Powerset
 * Your mastery of Martial Assault allows you to deliver crippling blows to your enemies and rain blades upon foes who don't dare approach you. You deliver damage to your enemies via withering kicks and punches in melee range, while your skills with thrown blades cut down aggressors from afar. Your attacks have a tendency to knock opponents down or deal additional damage over time as a secondary effect.
 *
 * Archetype: dominator
 * Category: secondary
 * Source: dominator_assault/martial_assault
 */

import type { Powerset } from '@/types';

import { ShurikenThrow as ShurikenThrow } from './shuriken-throw';
import { ThunderKick as ThunderKick } from './thunder-kick';
import { TrickShot as TrickShot } from './trick-shot';
import { SpinningKick as SpinningKick } from './spinning-kick';
import { EnvenomedBlades as EnvenomedBlades } from './envenomed-blades';
import { DragonsTail as DragonsTail } from './dragon-s-tail';
import { Caltrops as Caltrops } from './caltrops';
import { MasterfulThrow as MasterfulThrow } from './masterful-throw';
import { ExplosiveShuriken as ExplosiveShuriken } from './explosive-shuriken';

export const powerset: Powerset = {
  id: 'dominator/martial-assault',
  name: 'Martial Assault',
  description: 'Your mastery of Martial Assault allows you to deliver crippling blows to your enemies and rain blades upon foes who don\'t dare approach you. You deliver damage to your enemies via withering kicks and punches in melee range, while your skills with thrown blades cut down aggressors from afar. Your attacks have a tendency to knock opponents down or deal additional damage over time as a secondary effect.',
  icon: 'martial_assault_set.png',
  archetype: 'dominator',
  category: 'secondary',
  powers: [
    ShurikenThrow,
    ThunderKick,
    TrickShot,
    SpinningKick,
    EnvenomedBlades,
    DragonsTail,
    Caltrops,
    MasterfulThrow,
    ExplosiveShuriken,
  ],
};

export default powerset;
