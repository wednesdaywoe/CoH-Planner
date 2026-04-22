/**
 * Arachnos Soldier Powerset
 * Character with Arachnos Soldier training begin their careers as Wolf Spiders. Wolf Spider characters have a strong mix of Melee and Ranged attacks and strong protective powers available via their power armor. Beginning at level 24, the player has to choose whether he will progress down the "Crab Spider" or "Bane Spider" path. Crab Spiders gain access to the "backpack" and the powerful claw/cone attacks it provides, while the Bane Spider track provides stealth and a stronger focus on melee.
 *
 * Archetype: arachnos-soldier
 * Category: epic
 * Source: arachnos_soldiers/arachnos_soldier
 */

import type { Powerset } from '@/types';

import { Pummel as Pummel } from './pummel';
import { SingleShot as SingleShot } from './single-shot';
import { Burst as Burst } from './burst';
import { WideAreaWebGrenade as WideAreaWebGrenade } from './ws-wide-area-web-grenade';
import { HeavyBurst as HeavyBurst } from './heavy-burst';
import { Bayonet as Bayonet } from './bayonet';
import { VenomGrenade as VenomGrenade } from './venom-grenade';
import { FragGrenade as FragGrenade } from './frag-grenade';

export const powerset: Powerset = {
  id: 'arachnos-soldier/arachnos-soldier',
  name: 'Arachnos Soldier',
  description: 'Character with Arachnos Soldier training begin their careers as Wolf Spiders. Wolf Spider characters have a strong mix of Melee and Ranged attacks and strong protective powers available via their power armor. Beginning at level 24, the player has to choose whether he will progress down the "Crab Spider" or "Bane Spider" path. Crab Spiders gain access to the "backpack" and the powerful claw/cone attacks it provides, while the Bane Spider track provides stealth and a stronger focus on melee.',
  icon: 'arachnos_soldier_set.ico',
  archetype: 'arachnos-soldier',
  category: 'epic',
  powers: [
    Pummel,
    SingleShot,
    Burst,
    WideAreaWebGrenade,
    HeavyBurst,
    Bayonet,
    VenomGrenade,
    FragGrenade,
  ],
};

export default powerset;
