/**
 * Dark Blast Powerset
 * Dark Blast summons the powers of the Netherworld to defeat your foes. The draining effects of most of these powers can reduce your targets' chance to hit.
 *
 * Archetype: defender
 * Category: secondary
 * Source: defender_ranged/dark_blast
 */

import type { Powerset } from '@/types';

import { DarkBlast as DarkBlast } from './dark-blast';
import { Gloom as Gloom } from './gloom';
import { Moonbeam as Moonbeam } from './moonbeam';
import { DarkPit as DarkPit } from './dark-pit';
import { TenebrousTentacles as TenebrousTentacles } from './tenebrous-tentacles';
import { NightFall as NightFall } from './night-fall';
import { Torrent as Torrent } from './torrent';
import { LifeDrain as LifeDrain } from './life-drain';
import { Blackstar as Blackstar } from './blackstar';

export const powerset: Powerset = {
  id: 'defender/dark-blast',
  name: 'Dark Blast',
  description: 'Dark Blast summons the powers of the Netherworld to defeat your foes. The draining effects of most of these powers can reduce your targets\' chance to hit.',
  icon: 'dark_blast_set.png',
  archetype: 'defender',
  category: 'secondary',
  powers: [
    DarkBlast,
    Gloom,
    Moonbeam,
    DarkPit,
    TenebrousTentacles,
    NightFall,
    Torrent,
    LifeDrain,
    Blackstar,
  ],
};

export default powerset;
