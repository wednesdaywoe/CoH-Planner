/**
 * Psionic Armor Powerset
 * You use your psionic powers to shield yourself reducing incoming damage, as well as steal your foes own psyche and use it against them, be it by empowering your own regenerative powers, weakening their defenses or completely subduing their will.
 *
 * Archetype: stalker
 * Category: secondary
 * Source: stalker_defense/psionic_armor
 */

import type { Powerset } from '@/types';

import { Hide as Hide } from './hide';
import { PsychicWall as PsychicWall } from './psychic-wall';
import { PsionicShield as PsionicShield } from './psionic-shield';
import { ImpenetrableMind as ImpenetrableMind } from './impenetrable-mind';
import { DevourPsyche as DevourPsyche } from './devour-psyche';
import { PsychokineticBarrier as PsychokineticBarrier } from './psychokinetic-barrier';
import { Precognition as Precognition } from './precognition';
import { AuraofMadness as AuraofMadness } from './aura-of-madness';
import { MementoMori as MementoMori } from './memento-mori';

export const powerset: Powerset = {
  id: 'stalker/psionic-armor',
  name: 'Psionic Armor',
  description: 'You use your psionic powers to shield yourself reducing incoming damage, as well as steal your foes own psyche and use it against them, be it by empowering your own regenerative powers, weakening their defenses or completely subduing their will.',
  icon: 'dark_armor_set.png',
  archetype: 'stalker',
  category: 'secondary',
  powers: [
    Hide,
    PsychicWall,
    PsionicShield,
    ImpenetrableMind,
    DevourPsyche,
    PsychokineticBarrier,
    Precognition,
    AuraofMadness,
    MementoMori,
  ],
};

export default powerset;
