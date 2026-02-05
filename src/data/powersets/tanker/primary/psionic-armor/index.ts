/**
 * Psionic Armor Powerset
 * You use your psionic powers to shield yourself reducing incoming damage, as well as steal your foes own psyche and use it against them, be it by empowering your own regenerative powers, weakening their defenses or completely subduing their will.
 *
 * Archetype: tanker
 * Category: primary
 * Source: tanker_defense/psionic_armor
 */

import type { Powerset } from '@/types';

import { PsionicShield as PsionicShield } from './psionic-shield';
import { PsychicWall as PsychicWall } from './psychic-wall';
import { ImpenetrableMind as ImpenetrableMind } from './impenetrable-mind';
import { ConsumePsyche as ConsumePsyche } from './consume-psyche';
import { ImposePresence as ImposePresence } from './impose-presence';
import { PsychokineticBarrier as PsychokineticBarrier } from './psychokinetic-barrier';
import { Precognition as Precognition } from './precognition';
import { AuraofInsanity as AuraofInsanity } from './aura-of-insanity';
import { MementoMori as MementoMori } from './memento-mori';

export const powerset: Powerset = {
  id: 'tanker/psionic-armor',
  name: 'Psionic Armor',
  description: 'You use your psionic powers to shield yourself reducing incoming damage, as well as steal your foes own psyche and use it against them, be it by empowering your own regenerative powers, weakening their defenses or completely subduing their will.',
  icon: 'dark_armor_set.png',
  archetype: 'tanker',
  category: 'primary',
  powers: [
    PsionicShield,
    PsychicWall,
    ImpenetrableMind,
    ConsumePsyche,
    ImposePresence,
    PsychokineticBarrier,
    Precognition,
    AuraofInsanity,
    MementoMori,
  ],
};

export default powerset;
