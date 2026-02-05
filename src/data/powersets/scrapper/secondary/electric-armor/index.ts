/**
 * Electric Armor Powerset
 * Your entire body is basically a powerful capacitor. You can store and release massive amounts of electricity that can absorb damage directed at you. Electric Armor offers better than average resistance to just about all types of damage, including Psionic, but has no defense boosting powers or resistance to Toxic. Electric Armor also offers superior resistance to Energy damage and Endurance Drain.
 *
 * Archetype: scrapper
 * Category: secondary
 * Source: scrapper_defense/electric_armor
 */

import type { Powerset } from '@/types';

import { ChargedArmor as ChargedArmor } from './charged-armor';
import { LightningField as LightningField } from './lightning-field';
import { ConductiveShield as ConductiveShield } from './conductive-shield';
import { StaticShield as StaticShield } from './static-shield';
import { Grounded as Grounded } from './grounded';
import { Energize as Energize } from './energize';
import { LightningReflexes as LightningReflexes } from './lightning-reflexes';
import { PowerSink as PowerSink } from './power-sink';
import { PowerSurge as PowerSurge } from './power-surge';

export const powerset: Powerset = {
  id: 'scrapper/electric-armor',
  name: 'Electric Armor',
  description: 'Your entire body is basically a powerful capacitor. You can store and release massive amounts of electricity that can absorb damage directed at you. Electric Armor offers better than average resistance to just about all types of damage, including Psionic, but has no defense boosting powers or resistance to Toxic. Electric Armor also offers superior resistance to Energy damage and Endurance Drain.',
  icon: 'electric_armor_set.png',
  archetype: 'scrapper',
  category: 'secondary',
  powers: [
    ChargedArmor,
    LightningField,
    ConductiveShield,
    StaticShield,
    Grounded,
    Energize,
    LightningReflexes,
    PowerSink,
    PowerSurge,
  ],
};

export default powerset;
