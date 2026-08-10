/**
 * Fiery Assault Powerset
 * Fiery Assault allows you to conjure up flaming melee attacks and hurl devastating fiery projectiles. Fiery Assault powers tend to set foes ablaze for added Damage Over Time.
 *
 * Archetype: dominator
 * Category: secondary
 * Source: dominator_assault/fiery_assault
 */

import type { Powerset } from '@/types';

import { Flares as Flares } from './flares';
import { Incinerate as Incinerate } from './incinerate';
import { FireBreath as FireBreath } from './fire-breath';
import { FireBlast as FireBlast } from './fire-blast';
import { FieryEmbrace as FieryEmbrace } from './fiery-embrace';
import { Combustion as Combustion } from './combustion';
import { Consume as Consume } from './consume';
import { BlazingBolt as BlazingBolt } from './blazing-bolt';
import { Blaze as Blaze } from './blaze';

export const powerset: Powerset = {
  id: 'dominator/fiery-assault',
  setPath: 'Dominator_Assault.Fiery_Assault',
  name: 'Fiery Assault',
  buyRequires: [],
  buyRequiresFailed: "",
  specializeAt: 0,
  specializeRequires: [],
  description: 'Fiery Assault allows you to conjure up flaming melee attacks and hurl devastating fiery projectiles. Fiery Assault powers tend to set foes ablaze for added Damage Over Time.',
  icon: 'fiery_assault_set.ico',
  archetype: 'dominator',
  category: 'secondary',
  powers: [
    Flares,
    Incinerate,
    FireBreath,
    FireBlast,
    FieryEmbrace,
    Combustion,
    Consume,
    BlazingBolt,
    Blaze,
  ],
};

export default powerset;
