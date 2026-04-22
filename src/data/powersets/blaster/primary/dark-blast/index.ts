/**
 * Dark Blast Powerset
 * Dark Blast summons the powers of the Netherworld to defeat your foes. The draining effects of most of these powers can reduce your targets' chance to hit.
 *
 * Archetype: blaster
 * Category: primary
 * Source: blaster_ranged/dark_blast
 */

import type { Powerset } from '@/types';

import { AbyssalGaze as AbyssalGaze } from './abyssal-gaze';
import { Aim as Aim } from './aim';
import { Blackstar as Blackstar } from './blackstar';
import { DarkBlast as DarkBlast } from './dark-blast';
import { Gloom as Gloom } from './gloom';
import { LifeDrain as LifeDrain } from './life-drain';
import { Moonbeam as Moonbeam } from './moonbeam';
import { TenebrousTentacles as TenebrousTentacles } from './tenebrous-tentacles';
import { UmbralTorrent as UmbralTorrent } from './umbral-torrent';

export const powerset: Powerset = {
  id: 'blaster/dark-blast',
  name: 'Dark Blast',
  description: 'Dark Blast summons the powers of the Netherworld to defeat your foes. The draining effects of most of these powers can reduce your targets\' chance to hit.',
  icon: 'dark_blast_set.ico',
  archetype: 'blaster',
  category: 'primary',
  powers: [
    AbyssalGaze,
    Aim,
    Blackstar,
    DarkBlast,
    Gloom,
    LifeDrain,
    Moonbeam,
    TenebrousTentacles,
    UmbralTorrent,
  ],
};

export default powerset;
