/**
 * Knights Powerset
 * Knights are quick to pledge their loyalty to a just cause  and a honorable leader. The Knights have been scattered for centuries but have begun to reunite under a single banner. Unlike other Masterminds this one leads the charge inspiring the knights around him.
 *
 * Archetype: mastermind
 * Category: primary
 * Source: mastermind_summon/knights
 */

import type { Powerset } from '@/types';

import { Chop as Chop } from './chop';
import { CallArcher as CallArcher } from './call-archer';
import { Beheader as Beheader } from './beheader';
import { EquipKnights as EquipKnights } from './equip-knights';
import { WhirlingAxe as WhirlingAxe } from './whirling-axe';
import { CallMenAtArms as CallMenAtArms } from './call-men-at-arms';
import { RallyTheMilitia as RallyTheMilitia } from './rally-the-militia';
import { CallKnight as CallKnight } from './call-knight';
import { UpgradeEquipment as UpgradeEquipment } from './upgrade-equipment';

export const powerset: Powerset = {
  id: 'mastermind/knights',
  name: 'Knights',
  description: 'Knights are quick to pledge their loyalty to a just cause  and a honorable leader. The Knights have been scattered for centuries but have begun to reunite under a single banner. Unlike other Masterminds this one leads the charge inspiring the knights around him.',
  icon: 'knights_set.ico',
  archetype: 'mastermind',
  category: 'primary',
  powers: [
    Chop,
    CallArcher,
    Beheader,
    EquipKnights,
    WhirlingAxe,
    CallMenAtArms,
    RallyTheMilitia,
    CallKnight,
    UpgradeEquipment,
  ],
};

export default powerset;
