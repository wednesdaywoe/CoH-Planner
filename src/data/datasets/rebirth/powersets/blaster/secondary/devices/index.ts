/**
 * Devices Powerset
 * Devices are equipment you have constructed for use in combat. By using them strategically, you can gain a great tactical advantage. Traps, non-lethal munitions, and demolitions are available in this power set.
 *
 * Archetype: blaster
 * Category: secondary
 * Source: blaster_support/gadgets
 */

import type { Powerset } from '@/types';

import { WebGrenade as WebGrenade } from './web-grenade';
import { Caltrops as Caltrops } from './caltrops';
import { Taser as Taser } from './taser';
import { TargetingDrone as TargetingDrone } from './targeting-drone';
import { SmokeGrenade as SmokeGrenade } from './smoke-grenade';
import { FieldOperative as FieldOperative } from './cloaking-device';
import { TripMine as TripMine } from './trip-mine';
import { TimeBomb as TimeBomb } from './time-bomb';
import { GunDrone as GunDrone } from './auto-turret';

export const powerset: Powerset = {
  id: 'blaster/devices',
  name: 'Devices',
  description: 'Devices are equipment you have constructed for use in combat. By using them strategically, you can gain a great tactical advantage. Traps, non-lethal munitions, and demolitions are available in this power set.',
  icon: 'gadgets_set.ico',
  archetype: 'blaster',
  category: 'secondary',
  powers: [
    WebGrenade,
    Caltrops,
    Taser,
    TargetingDrone,
    SmokeGrenade,
    FieldOperative,
    TripMine,
    TimeBomb,
    GunDrone,
  ],
};

export default powerset;
