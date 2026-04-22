/**
 * Ninjas Powerset
 * You are known by many names... Sensei, Shogun, Kage, Lord. What you are is a Master of the most deadly assassins the world has ever seen... You are a Ninja Master. Command your Ninja Henchmen and even train them in new weapons and techniques. Ninjas have superior reflexes and can even super leap. Their training makes them highly resistant to Confusion. Ninja Henchmen cannot be resurrected.
 *
 * Archetype: mastermind
 * Category: primary
 * Source: mastermind_summon/ninjas
 */

import type { Powerset } from '@/types';

import { AimedShot as AimedShot } from './aimed-shot';
import { CallGenin as CallGenin } from './call-genin';
import { CallJounin as CallJounin } from './call-jounin';
import { FistfulofArrows as FistfulofArrows } from './fistful-of-arrows';
import { KujiInZen as KujiInZen } from './kuji-in-zen';
import { Oni as Oni } from './oni';
import { SmokeFlash as SmokeFlash } from './smoke-flash';
import { SnapShot as SnapShot } from './snap-shot';
import { TrainNinjas as TrainNinjas } from './train-ninjas';

export const powerset: Powerset = {
  id: 'mastermind/ninjas',
  name: 'Ninjas',
  description: 'You are known by many names... Sensei, Shogun, Kage, Lord. What you are is a Master of the most deadly assassins the world has ever seen... You are a Ninja Master. Command your Ninja Henchmen and even train them in new weapons and techniques. Ninjas have superior reflexes and can even super leap. Their training makes them highly resistant to Confusion. Ninja Henchmen cannot be resurrected.',
  icon: 'ninjas_set.ico',
  archetype: 'mastermind',
  category: 'primary',
  powers: [
    AimedShot,
    CallGenin,
    CallJounin,
    FistfulofArrows,
    KujiInZen,
    Oni,
    SmokeFlash,
    SnapShot,
    TrainNinjas,
  ],
};

export default powerset;
