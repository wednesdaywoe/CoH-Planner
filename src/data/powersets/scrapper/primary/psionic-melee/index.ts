/**
 * Psionic Melee Powerset
 * You are able to strike at foes with psychic projections including deadly psi blades. Psionic Melee provides excellent crowd control by dominating the minds of its victims. Your psionic damaging attacks have a chance to grant you Insight into your enemies. While you have Insight, your psionic damage powers cause additional psionic damage over time and your Boggle and Psi Blade Sweep powers become more potent.
 *
 * Archetype: scrapper
 * Category: primary
 * Source: scrapper_melee/psionic_melee
 */

import type { Powerset } from '@/types';

import { Boggle as Boggle } from './boggle';
import { Concentration as Concentration } from './concentration';
import { Confront as Confront } from './confront';
import { GreaterPsiBlade as GreaterPsiBlade } from './greater-psi-blade';
import { PsiBlade as PsiBlade } from './psi-blade';
import { MassLevitate as MassLevitate } from './mass-levitate';
import { MentalStrike as MentalStrike } from './mental-strike';
import { PsiBladeSweep as PsiBladeSweep } from './psi-blade-sweep';
import { TelekineticBlow as TelekineticBlow } from './telekinetic-blow';

export const powerset: Powerset = {
  id: 'scrapper/psionic-melee',
  name: 'Psionic Melee',
  description: 'You are able to strike at foes with psychic projections including deadly psi blades. Psionic Melee provides excellent crowd control by dominating the minds of its victims. Your psionic damaging attacks have a chance to grant you Insight into your enemies. While you have Insight, your psionic damage powers cause additional psionic damage over time and your Boggle and Psi Blade Sweep powers become more potent.',
  icon: 'psionic_melee_set.ico',
  archetype: 'scrapper',
  category: 'primary',
  powers: [
    Boggle,
    Concentration,
    Confront,
    GreaterPsiBlade,
    PsiBlade,
    MassLevitate,
    MentalStrike,
    PsiBladeSweep,
    TelekineticBlow,
  ],
};

export default powerset;
