/**
 * Blight Melee Powerset
 * You believe that might makes right, and manifest fascist anger to brutalize your foes. Blight Melee attacks are slow, but heavy handed, with a small chance to drain endurance. Blight Melee attacks initially emphasize physical prowess in the one-on-one setting, dealing primarily smashing damage with a negative energy component. As your will to power is realized, your attacks will sprawl across the battlefield, and deal equal parts smashing and negative damage.
 *
 * Archetype: brute
 * Category: primary
 * Source: brute_melee/blight_melee
 */

import type { Powerset } from '@/types';

import { CruelJab as CruelJab } from './cruel-jab';
import { CruelPunch as CruelPunch } from './cruel-punch';
import { CruelHaymaker as CruelHaymaker } from './cruel-haymaker';
import { AuraofDomination as AuraofDomination } from './aura-of-domination';
import { FascistCharisma as FascistCharisma } from './fascist-charisma';
import { CruelKnockoutBlow as CruelKnockoutBlow } from './cruel-knockout-blow';
import { Taunt as Taunt } from './taunt';
import { SapWill as SapWill } from './sap-will';
import { DarkLightningNet as DarkLightningNet } from './dark-lightning-net';
import { FistofFascism as FistofFascism } from './fist-of-fascism';

export const powerset: Powerset = {
  id: 'brute/blight-melee',
  name: 'Blight Melee',
  description: 'You believe that might makes right, and manifest fascist anger to brutalize your foes. Blight Melee attacks are slow, but heavy handed, with a small chance to drain endurance. Blight Melee attacks initially emphasize physical prowess in the one-on-one setting, dealing primarily smashing damage with a negative energy component. As your will to power is realized, your attacks will sprawl across the battlefield, and deal equal parts smashing and negative damage.',
  icon: 'broad_sword_set.ico',
  archetype: 'brute',
  category: 'primary',
  powers: [
    CruelJab,
    CruelPunch,
    CruelHaymaker,
    AuraofDomination,
    FascistCharisma,
    CruelKnockoutBlow,
    Taunt,
    SapWill,
    DarkLightningNet,
    FistofFascism,
  ],
};

export default powerset;
