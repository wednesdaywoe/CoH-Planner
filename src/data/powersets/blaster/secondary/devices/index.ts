/**
 * Devices Powerset
 * Devices are equipment you have constructed for use in combat. By using them strategically, you can gain a great tactical advantage. Traps, non-lethal munitions, and demolitions are available in this power set.
 *
 * Archetype: blaster
 * Category: secondary
 * Source: blaster_support/gadgets
 */

import type { Powerset } from '@/types';

import { Caltrops as Caltrops } from './caltrops';
import { ToxicWebGrenade as ToxicWebGrenade } from './toxic-web-grenade';
import { Taser as Taser } from './taser';
import { TargetingDrone as TargetingDrone } from './targeting-drone';
import { SmokeGrenade as SmokeGrenade } from './smoke-grenade';
import { FieldOperative as FieldOperative } from './field-operative';
import { TripMine as TripMine } from './trip-mine';
import { RemoteBomb as RemoteBomb } from './remote-bomb';
import { GunDrone as GunDrone } from './gun-drone';

export const powerset: Powerset = {
  id: 'blaster/devices',
  name: 'Devices',
  description: 'Devices are equipment you have constructed for use in combat. By using them strategically, you can gain a great tactical advantage. Traps, non-lethal munitions, and demolitions are available in this power set.',
  icon: 'gadgets_set.png',
  archetype: 'blaster',
  category: 'secondary',
  powers: [
    Caltrops,
    ToxicWebGrenade,
    Taser,
    TargetingDrone,
    SmokeGrenade,
    FieldOperative,
    TripMine,
    RemoteBomb,
    GunDrone,
  ],
};

export default powerset;
