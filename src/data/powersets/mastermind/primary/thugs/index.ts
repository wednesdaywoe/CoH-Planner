/**
 * Thugs Powerset
 * Street-wise and extremely loyal to the right leader, Thugs make the perfect Henchmen for a manipulative Mastermind. The Rogue Isle are a perfect breeding ground for Thugs, and 'street-cred' can go a long way. Thugs are no stranger to urban warfare, and they are quite proficient with various weapons. Most Thugs aren't particularly resistant to any damage type, but their Lieutenants possess good Leadership skills to harden all your Henchmen.
 *
 * Archetype: mastermind
 * Category: primary
 * Source: mastermind_summon/thugs
 */

import type { Powerset } from '@/types';

import { CallThugs as CallThugs } from './call-thugs';
import { Pistols as Pistols } from './pistols';
import { DualWield as DualWield } from './dual-wield';
import { EquipThugs as EquipThugs } from './equip-thugs';
import { EmptyClips as EmptyClips } from './empty-clips';
import { CallEnforcer as CallEnforcer } from './call-enforcer';
import { GangWar as GangWar } from './gang-war';
import { CallBruiser as CallBruiser } from './call-bruiser';
import { UpgradeEquipment as UpgradeEquipment } from './upgrade-equipment';

export const powerset: Powerset = {
  id: 'mastermind/thugs',
  name: 'Thugs',
  description: 'Street-wise and extremely loyal to the right leader, Thugs make the perfect Henchmen for a manipulative Mastermind. The Rogue Isle are a perfect breeding ground for Thugs, and \'street-cred\' can go a long way. Thugs are no stranger to urban warfare, and they are quite proficient with various weapons. Most Thugs aren\'t particularly resistant to any damage type, but their Lieutenants possess good Leadership skills to harden all your Henchmen.',
  icon: 'thugs_set.png',
  archetype: 'mastermind',
  category: 'primary',
  powers: [
    CallThugs,
    Pistols,
    DualWield,
    EquipThugs,
    EmptyClips,
    CallEnforcer,
    GangWar,
    CallBruiser,
    UpgradeEquipment,
  ],
};

export default powerset;
