/**
 * Arsenal Control Powerset
 * Armed with a state-of-the-art multipurpose rifle, you are able to deliver a wide variety of payloads to control your enemies and render them incapable of responding.
 *
 * Archetype: dominator
 * Category: primary
 * Source: dominator_control/arsenal_control
 */

import type { Powerset } from '@/types';

import { CloakingDevice as CloakingDevice } from './cloaking-device';
import { CryoFreezeRay as CryoFreezeRay } from './cryo-freeze-ray';
import { FlashBang as FlashBang } from './flash-bang';
import { TriCannon as TriCannon } from './gun-drone';
import { LiquidNitrogen as LiquidNitrogen } from './liquid-nitrogen';
import { SleepGrenade as SleepGrenade } from './sleep-grenade';
import { SmokeCanister as SmokeCanister } from './smoke-grenade';
import { TearGas as TearGas } from './tear-gas';
import { Tranquilizer as Tranquilizer } from './tranquilizer';

export const powerset: Powerset = {
  id: 'dominator/arsenal-control',
  name: 'Arsenal Control',
  description: 'Armed with a state-of-the-art multipurpose rifle, you are able to deliver a wide variety of payloads to control your enemies and render them incapable of responding.',
  icon: 'assault_rifle_set.ico',
  archetype: 'dominator',
  category: 'primary',
  powers: [
    CloakingDevice,
    CryoFreezeRay,
    FlashBang,
    TriCannon,
    LiquidNitrogen,
    SleepGrenade,
    SmokeCanister,
    TearGas,
    Tranquilizer,
  ],
};

export default powerset;
