/**
 * Shield Charge — OVERRIDES LAYER
 *
 * Binary extraction reports `targetType: "Dead Teammate"` because the
 * underlying mechanic is a teleport-then-summon. For UI purposes the
 * power is a Foe-targeted AoE attack.
 */
import type { Power } from '@/types';

export const overrides: Partial<Power> = {};
