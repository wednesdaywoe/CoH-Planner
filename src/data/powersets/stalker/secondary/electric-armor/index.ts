/**
 * Electric Armor Powerset
 * Your entire body is basically a powerful capacitor. You can store and release massive amounts of electricity that can absorb damage directed at you. Electric Armor offer better than average resistance to just about all types of damage, including Psionic, but has no healing abilities or resistance to Toxic. Electric Armor also offers superior resistance to Energy damage and Endurance Drain.
 *
 * Archetype: stalker
 * Category: secondary
 * Source: stalker_defense/electric_armor
 */

import type { Powerset } from '@/types';

import { ChargedArmor as ChargedArmor } from './charged-armor';
import { ConductiveShield as ConductiveShield } from './conductive-shield';
import { Energize as Energize } from './conserve-power';
import { Grounded as Grounded } from './grounded';
import { Hide as Hide } from './hide';
import { LightningReflexes as LightningReflexes } from './lightning-reflexes';
import { PowerSink as PowerSink } from './power-sink';
import { PowerSurge as PowerSurge } from './power-surge';
import { StaticShield as StaticShield } from './static-shield';

export const powerset: Powerset = {
  id: 'stalker/electric-armor',
  name: 'Electric Armor',
  description: 'Your entire body is basically a powerful capacitor. You can store and release massive amounts of electricity that can absorb damage directed at you. Electric Armor offer better than average resistance to just about all types of damage, including Psionic, but has no healing abilities or resistance to Toxic. Electric Armor also offers superior resistance to Energy damage and Endurance Drain.',
  icon: 'electric_armor_set.ico',
  archetype: 'stalker',
  category: 'secondary',
  powers: [
    ChargedArmor,
    ConductiveShield,
    Energize,
    Grounded,
    Hide,
    LightningReflexes,
    PowerSink,
    PowerSurge,
    StaticShield,
  ],
};

export default powerset;
