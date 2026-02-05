/**
 * Arsenal Control Powerset
 * Armed with a state-of-the-art multipurpose rifle, you are able to deliver a wide variety of payloads to control your enemies and render them incapable of responding.
 *
 * Archetype: dominator
 * Category: primary
 * Source: dominator_control/arsenal_control
 */

import type { Powerset } from '@/types';

import { CryoFreezeRay as CryoFreezeRay } from './cryo-freeze-ray';
import { Tranquilizer as Tranquilizer } from './tranquilizer';
import { SleepGrenade as SleepGrenade } from './sleep-grenade';
import { LiquidNitrogen as LiquidNitrogen } from './liquid-nitrogen';
import { CloakingDevice as CloakingDevice } from './cloaking-device';
import { SmokeCanister as SmokeCanister } from './smoke-canister';
import { FlashBang as FlashBang } from './flash-bang';
import { TearGas as TearGas } from './tear-gas';
import { TriCannon as TriCannon } from './tri-cannon';

export const powerset: Powerset = {
  id: 'dominator/arsenal-control',
  name: 'Arsenal Control',
  description: 'Armed with a state-of-the-art multipurpose rifle, you are able to deliver a wide variety of payloads to control your enemies and render them incapable of responding.',
  icon: 'assault_rifle_set.png',
  archetype: 'dominator',
  category: 'primary',
  powers: [
    CryoFreezeRay,
    Tranquilizer,
    SleepGrenade,
    LiquidNitrogen,
    CloakingDevice,
    SmokeCanister,
    FlashBang,
    TearGas,
    TriCannon,
  ],
};

export default powerset;
