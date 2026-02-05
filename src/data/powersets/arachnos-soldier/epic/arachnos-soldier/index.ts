/**
 * Arachnos Soldier Proxy Powerset
 * Character with Arachnos Soldier training begin their careers as Wolf Spiders. Wolf Spider characters have a strong mix of Melee and Ranged attacks and strong protective powers available via their power armor. Beginning at level 24, the player has to choose whether he will progress down the "Crab Spider" or "Bane Spider" path. Crab Spiders gain access to the "backpack" and the powerful claw/cone attacks it provides, while the Bane Spider track provides stealth and a stronger focus on melee.
 *
 * Archetype: arachnos-soldier
 * Category: Epic
 */

import type { Powerset } from '@/types';

import { SingleShot } from './single-shot';
import { Pummel } from './pummel';
import { Burst } from './burst';
import { WideAreaWebGrenade } from './wide-area-web-grenade';
import { HeavyBurst } from './heavy-burst';
import { Bayonet } from './bayonet';
import { VenomGrenade } from './venom-grenade';
import { FragGrenade } from './frag-grenade';

export const powerset: Powerset = {
  id: 'arachnos-soldier/arachnos-soldier',
  name: 'Arachnos Soldier Proxy',
  description: 'Character with Arachnos Soldier training begin their careers as Wolf Spiders. Wolf Spider characters have a strong mix of Melee and Ranged attacks and strong protective powers available via their power armor. Beginning at level 24, the player has to choose whether he will progress down the "Crab Spider" or "Bane Spider" path. Crab Spiders gain access to the "backpack" and the powerful claw/cone attacks it provides, while the Bane Spider track provides stealth and a stronger focus on melee.',
  icon: 'arachnos_soldier_proxy_set.png',
  archetype: 'arachnos-soldier',
  category: 'epic',
  powers: [
    SingleShot,
    Pummel,
    Burst,
    WideAreaWebGrenade,
    HeavyBurst,
    Bayonet,
    VenomGrenade,
    FragGrenade,
  ],
};

export default powerset;
