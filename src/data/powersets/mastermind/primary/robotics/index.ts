/**
 * Robotics Powerset
 * Robotics allows you to construct an army of mechanical henchmen and repair and upgrade them in order to keep your army in tip-top shape. Robot Henchmen generally have good resistances to Lethal, Cold and Psionic damage, as well as Sleep, Fear and Disorient. They are vulnerable to EMP attacks. Robot Henchmen cannot be resurrected.
 *
 * Archetype: mastermind
 * Category: primary
 * Source: mastermind_summon/robotics
 */

import type { Powerset } from '@/types';

import { BattleDrones as BattleDrones } from './battle-drones';
import { PulseRifleBlast as PulseRifleBlast } from './pulse-rifle-blast';
import { PulseRifleBurst as PulseRifleBurst } from './pulse-rifle-burst';
import { EquipRobot as EquipRobot } from './equip-robot';
import { PhotonGrenade as PhotonGrenade } from './photon-grenade';
import { ProtectorBots as ProtectorBots } from './protector-bots';
import { MaintenanceDrone as MaintenanceDrone } from './maintenance-drone';
import { AssaultBot as AssaultBot } from './assault-bot';
import { UpgradeRobot as UpgradeRobot } from './upgrade-robot';

export const powerset: Powerset = {
  id: 'mastermind/robotics',
  name: 'Robotics',
  description: 'Robotics allows you to construct an army of mechanical henchmen and repair and upgrade them in order to keep your army in tip-top shape. Robot Henchmen generally have good resistances to Lethal, Cold and Psionic damage, as well as Sleep, Fear and Disorient. They are vulnerable to EMP attacks. Robot Henchmen cannot be resurrected.',
  icon: 'robotics_set.png',
  archetype: 'mastermind',
  category: 'primary',
  powers: [
    BattleDrones,
    PulseRifleBlast,
    PulseRifleBurst,
    EquipRobot,
    PhotonGrenade,
    ProtectorBots,
    MaintenanceDrone,
    AssaultBot,
    UpgradeRobot,
  ],
};

export default powerset;
