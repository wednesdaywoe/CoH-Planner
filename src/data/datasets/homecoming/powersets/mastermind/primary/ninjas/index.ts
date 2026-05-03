/**
 * Ninjas Powerset
 * You are known by many names... Sensei, Shogun, Kage, Lord. What you are is a Master of the most deadly assassins the world has ever seen... You are a Ninja Master. Command your Ninja Henchmen and even train them in new weapons and techniques. Ninjas have superior reflexes and can even super leap. Their training makes them highly resistant to Confusion. Ninja Henchmen cannot be resurrected.
 *
 * Archetype: mastermind
 * Category: primary
 * Source: mastermind_summon/ninjas
 */

import type { Powerset } from '@/types';

import { SnapShot as SnapShot } from './snap-shot';
import { CallGenin as CallGenin } from './call-genin';
import { AimedShot as AimedShot } from './aimed-shot';
import { TrainNinjas as TrainNinjas } from './train-ninjas';
import { FistfulofArrows as FistfulofArrows } from './fistful-of-arrows';
import { CallJounin as CallJounin } from './call-jounin';
import { SmokeFlash as SmokeFlash } from './smoke-flash';
import { Oni as Oni } from './oni';
import { KujiInZen as KujiInZen } from './kuji-in-zen';

export const powerset: Powerset = {
  id: 'mastermind/ninjas',
  name: 'Ninjas',
  description: 'You are known by many names... Sensei, Shogun, Kage, Lord. What you are is a Master of the most deadly assassins the world has ever seen... You are a Ninja Master. Command your Ninja Henchmen and even train them in new weapons and techniques. Ninjas have superior reflexes and can even super leap. Their training makes them highly resistant to Confusion. Ninja Henchmen cannot be resurrected.',
  icon: 'ninjas_set.ico',
  archetype: 'mastermind',
  category: 'primary',
  powers: [
    SnapShot,
    CallGenin,
    AimedShot,
    TrainNinjas,
    FistfulofArrows,
    CallJounin,
    SmokeFlash,
    Oni,
    KujiInZen,
  ],
};

export default powerset;
