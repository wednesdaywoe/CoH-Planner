/**
 * Devices Powerset
 * Devices are equipment you have constructed for use in combat. By using them strategically, you can gain a great tactical advantage. Traps, non-lethal munitions, and demolitions are available in this power set.
 *
 * Archetype: blaster
 * Category: secondary
 * Source: blaster_support/gadgets
 */

import type { Powerset } from '@/types';

import { GunDrone as GunDrone } from './auto-turret';
import { Caltrops as Caltrops } from './caltrops';
import { FieldOperative as FieldOperative } from './cloaking-device';
import { SmokeGrenade as SmokeGrenade } from './smoke-grenade';
import { TargetingDrone as TargetingDrone } from './targeting-drone';
import { Taser as Taser } from './taser';
import { RemoteBomb as RemoteBomb } from './time-bomb';
import { TripMine as TripMine } from './trip-mine';
import { ToxicWebGrenade as ToxicWebGrenade } from './web-grenade';

export const powerset: Powerset = {
  id: 'blaster/devices',
  name: 'Devices',
  description: 'Devices are equipment you have constructed for use in combat. By using them strategically, you can gain a great tactical advantage. Traps, non-lethal munitions, and demolitions are available in this power set.',
  icon: 'gadgets_set.ico',
  archetype: 'blaster',
  category: 'secondary',
  powers: [
    GunDrone,
    Caltrops,
    FieldOperative,
    SmokeGrenade,
    TargetingDrone,
    Taser,
    RemoteBomb,
    TripMine,
    ToxicWebGrenade,
  ],
};

export default powerset;
