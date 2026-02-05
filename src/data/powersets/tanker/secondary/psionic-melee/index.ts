/**
 * Psionic Melee Powerset
 * You are able to strike at foes with psychic projections including deadly psi blades. Psionic Melee provides excellent crowd control by dominating the minds of its victims. Your psionic damaging attacks have a chance to grant you Insight into your enemies. While you have Insight, your psionic damage powers cause additional psionic damage over time and your Boggle and Psi Blade Sweep powers become more potent.
 *
 * Archetype: tanker
 * Category: secondary
 * Source: tanker_melee/psionic_melee
 */

import type { Powerset } from '@/types';

import { MentalStrike as MentalStrike } from './mental-strike';
import { PsiBlade as PsiBlade } from './psi-blade';
import { TelekineticBlow as TelekineticBlow } from './telekinetic-blow';
import { Taunt as Taunt } from './taunt';
import { PsiBladeSweep as PsiBladeSweep } from './psi-blade-sweep';
import { Concentration as Concentration } from './concentration';
import { Boggle as Boggle } from './boggle';
import { GreaterPsiBlade as GreaterPsiBlade } from './greater-psi-blade';
import { MassLevitate as MassLevitate } from './mass-levitate';

export const powerset: Powerset = {
  id: 'tanker/psionic-melee',
  name: 'Psionic Melee',
  description: 'You are able to strike at foes with psychic projections including deadly psi blades. Psionic Melee provides excellent crowd control by dominating the minds of its victims. Your psionic damaging attacks have a chance to grant you Insight into your enemies. While you have Insight, your psionic damage powers cause additional psionic damage over time and your Boggle and Psi Blade Sweep powers become more potent.',
  icon: 'psionic_melee_set.png',
  archetype: 'tanker',
  category: 'secondary',
  powers: [
    MentalStrike,
    PsiBlade,
    TelekineticBlow,
    Taunt,
    PsiBladeSweep,
    Concentration,
    Boggle,
    GreaterPsiBlade,
    MassLevitate,
  ],
};

export default powerset;
