/**
 * Marine Affinity Powerset
 * Command the various powers of the ocean to buff your allies, and wash away your enemies.
 *
 * Archetype: defender
 * Category: primary
 * Source: defender_buff/marine_affinity
 */

import type { Powerset } from '@/types';

import { Brine as Brine } from './brine';
import { PoweroftheDepths as PoweroftheDepths } from './call-depths';
import { ShiftingTides as ShiftingTides } from './shifting-tides';
import { ShoalRush as ShoalRush } from './shoal-rush';
import { SoothingWave as SoothingWave } from './soothing-wave';
import { TidePool as TidePool } from './tide-pool';
import { ToroidalBubble as ToroidalBubble } from './toroidal-bubble';
import { BarrierReef as BarrierReef } from './wellspring';
import { Whitecap as Whitecap } from './whitecap';

export const powerset: Powerset = {
  id: 'defender/marine-affinity',
  name: 'Marine Affinity',
  description: 'Command the various powers of the ocean to buff your allies, and wash away your enemies.',
  icon: 'nature_affinity_set.ico',
  archetype: 'defender',
  category: 'primary',
  powers: [
    Brine,
    PoweroftheDepths,
    ShiftingTides,
    ShoalRush,
    SoothingWave,
    TidePool,
    ToroidalBubble,
    BarrierReef,
    Whitecap,
  ],
};

export default powerset;
