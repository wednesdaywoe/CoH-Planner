/**
 * Dark Blast Powerset
 * Dark Blast summons the powers of the Netherworld to defeat your foes. The draining effects of most of these powers can reduce your targets' chance to hit.
 *
 * Archetype: sentinel
 * Category: primary
 * Source: sentinel_ranged/dark_blast
 */

import type { Powerset } from '@/types';

import { AbyssalGaze as AbyssalGaze } from './abyssal-gaze';
import { Aim as Aim } from './aim';
import { AntumbralBeam as AntumbralBeam } from './antumbral-beam';
import { Blackstar as Blackstar } from './blackstar';
import { DarkBlast as DarkBlast } from './dark-blast';
import { DarkObliteration as DarkObliteration } from './dark-obliteration';
import { Gloom as Gloom } from './gloom';
import { LifeDrain as LifeDrain } from './life-drain';
import { UmbralTorrent as UmbralTorrent } from './umbral-torrent';

export const powerset: Powerset = {
  id: 'sentinel/dark-blast',
  name: 'Dark Blast',
  description: 'Dark Blast summons the powers of the Netherworld to defeat your foes. The draining effects of most of these powers can reduce your targets\' chance to hit.',
  icon: 'dark_blast_set.ico',
  archetype: 'sentinel',
  category: 'primary',
  powers: [
    AbyssalGaze,
    Aim,
    AntumbralBeam,
    Blackstar,
    DarkBlast,
    DarkObliteration,
    Gloom,
    LifeDrain,
    UmbralTorrent,
  ],
};

export default powerset;
