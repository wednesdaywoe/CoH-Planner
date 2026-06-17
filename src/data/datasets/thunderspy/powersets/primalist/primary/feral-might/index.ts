/**
 * Feral Might Powerset
 * Primalists are competent melee combatants; this is enhanced by their ability to shapeshift into a Hunter or a Prowler form. While in Primal Form, the Primalist will deal good damage and heal nearby allies. When taking on the form of a Hunter you can attack foes with tooth and nail weakening nearby foes. When in the form of a Prowler you can shred enemies with your mighty claws stunning them.
 *
 * Archetype: primalist
 * Category: primary
 * Source: feral_might/feral_might
 */

import type { Powerset } from '@/types';

import { HuntersHowl as HuntersHowl } from './hunters-howl';
import { Pounce as Pounce } from './pounce';
import { FeralBlow as FeralBlow } from './feral-blow';
import { ViciousStrike as ViciousStrike } from './vicious-strike';
import { BrutalSwipe as BrutalSwipe } from './brutal-swipe';
import { HunterForm as HunterForm } from './hunter-form';
import { PackFrenzy as PackFrenzy } from './pack-frenzy';
import { CalloftheWild as CalloftheWild } from './call-of-the-wild';
import { PrimalStrike as PrimalStrike } from './primal-strike';
import { ProwlerForm as ProwlerForm } from './prowler-form';
import { NaturesBoon as NaturesBoon } from './natures-boon';
import { PrimalGuile as PrimalGuile } from './primal-guile';
import { Upheaval as Upheaval } from './upheaval';
import { SavageBlow as SavageBlow } from './savage-blow';

export const powerset: Powerset = {
  id: 'primalist/feral-might',
  name: 'Feral Might',
  description: 'Primalists are competent melee combatants; this is enhanced by their ability to shapeshift into a Hunter or a Prowler form. While in Primal Form, the Primalist will deal good damage and heal nearby allies. When taking on the form of a Hunter you can attack foes with tooth and nail weakening nearby foes. When in the form of a Prowler you can shred enemies with your mighty claws stunning them.',
  icon: 'feral_might_set.ico',
  archetype: 'primalist',
  category: 'primary',
  powers: [
    HuntersHowl,
    Pounce,
    FeralBlow,
    ViciousStrike,
    BrutalSwipe,
    HunterForm,
    PackFrenzy,
    CalloftheWild,
    PrimalStrike,
    ProwlerForm,
    NaturesBoon,
    PrimalGuile,
    Upheaval,
    SavageBlow,
  ],
};

export default powerset;
