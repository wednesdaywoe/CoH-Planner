/**
 * Dark Blast Powerset
 * Dark Blast summons the powers of the Netherworld to defeat your foes. The draining effects of most of these powers can reduce your targets' chance to hit.
 *
 * Archetype: blaster
 * Category: primary
 * Source: blaster_ranged/dark_blast
 */

import type { Powerset } from '@/types';

import { DarkBlast as DarkBlast } from './dark-blast';
import { Gloom as Gloom } from './gloom';
import { UmbralTorrent as UmbralTorrent } from './umbral-torrent';
import { Aim as Aim } from './aim';
import { Moonbeam as Moonbeam } from './moonbeam';
import { TenebrousTentacles as TenebrousTentacles } from './tenebrous-tentacles';
import { AbyssalGaze as AbyssalGaze } from './abyssal-gaze';
import { LifeDrain as LifeDrain } from './life-drain';
import { Blackstar as Blackstar } from './blackstar';

export const powerset: Powerset = {
  id: 'blaster/dark-blast',
  name: 'Dark Blast',
  description: 'Dark Blast summons the powers of the Netherworld to defeat your foes. The draining effects of most of these powers can reduce your targets\' chance to hit.',
  icon: 'dark_blast_set.png',
  archetype: 'blaster',
  category: 'primary',
  powers: [
    DarkBlast,
    Gloom,
    UmbralTorrent,
    Aim,
    Moonbeam,
    TenebrousTentacles,
    AbyssalGaze,
    LifeDrain,
    Blackstar,
  ],
};

export default powerset;
