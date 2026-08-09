/**
 * Spectral Melee Powerset
 * Spectral Melee allows you to focus the ghostly powers to defeat your foes. Your foes cower in fear from repeated exposure to your attacks, striking a fully feared target manifests a haunting spirit to assist you for a short time.
 *
 * Archetype: stalker
 * Category: primary
 * Source: stalker_melee/spectral_melee
 */

import type { Powerset } from '@/types';

import { HauntingStrike as HauntingStrike } from './haunting-strike';
import { HauntingBlow as HauntingBlow } from './haunting-blow';
import { GrippingTerror as GrippingTerror } from './gripping-terror';
import { AssassinsReave as AssassinsReave } from './assassins-reave';
import { BuildUp as BuildUp } from './build-up';
import { Placate as Placate } from './placate';
import { EncroachingNightmare as EncroachingNightmare } from './encroaching-nightmare';
import { NightmarishGrasp as NightmarishGrasp } from './nightmarish-grasp';
import { SpiritSunder as SpiritSunder } from './spirit-sunder';

export const powerset: Powerset = {
  id: 'stalker/spectral-melee',
  internalName: 'spectral_melee',
  name: 'Spectral Melee',
  description: 'Spectral Melee allows you to focus the ghostly powers to defeat your foes. Your foes cower in fear from repeated exposure to your attacks, striking a fully feared target manifests a haunting spirit to assist you for a short time.',
  icon: 'dark_melee_set.ico',
  archetype: 'stalker',
  category: 'primary',
  powers: [
    HauntingStrike,
    HauntingBlow,
    GrippingTerror,
    AssassinsReave,
    BuildUp,
    Placate,
    EncroachingNightmare,
    NightmarishGrasp,
    SpiritSunder,
  ],
};

export default powerset;
