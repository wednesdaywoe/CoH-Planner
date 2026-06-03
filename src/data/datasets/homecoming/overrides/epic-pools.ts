/**
 * Epic/Patron Pool overrides — hand-written deltas keyed by a power's
 * `fullName` (e.g. `Epic.VEAT_Leviathan_Mastery.Spirit_Shark`). The
 * composed facade (src/data/epic-pools-raw.ts) merges each entry into
 * its matching generated power via `withOverrides`.
 *
 * Empty record means no overrides. Add entries here when the stale
 * CoD2 raw extraction disagrees with current HC game values. See
 * src/data/README.md for the layering convention.
 */
import type { Power } from '@/types';

export const EPIC_POOL_OVERRIDES: Record<string, Partial<Power>> = {
  // +Accuracy self-buff restoration. Focused Accuracy / Targeting Drone /
  // Personal Force Field grant a flat +Accuracy (aspect=Strength on the Accuracy
  // attrib) that the old generated extraction dropped — the converter now emits
  // `accuracyBuff`, but a full epic-pools regen also surfaces unrelated stale mez
  // drift, so these merge the exact accuracyBuff values surgically instead.
  // Values copied verbatim from the converter (table varies by AT). Idempotent:
  // a future deliberate regen produces the same values, making these redundant.
  'Epic.Body_Mastery.Focused_Accuracy': { effects: { accuracyBuff: { scale: 0.2, table: 'Melee_Ones' } } },
  'Epic.Body_Mastery_Stalker.Focused_Accuracy': { effects: { accuracyBuff: { scale: 0.2, table: 'Melee_Ones' } } },
  'Epic.Brute_Mace_Mastery.Focused_Accuracy': { effects: { accuracyBuff: { scale: 0.2, table: 'Ranged_Ones' } } },
  'Epic.Controller_Mace_Mastery.Personal_Force_Field': { effects: { accuracyBuff: { scale: 0.2, table: 'Melee_Ones' } } },
  'Epic.Corruptor_Mace_Mastery.Focused_Accuracy': { effects: { accuracyBuff: { scale: 0.2, table: 'Melee_Ones' } } },
  'Epic.Energy_Mastery.Focused_Accuracy': { effects: { accuracyBuff: { scale: 0.2, table: 'Melee_Ones' } } },
  'Epic.Energy_Mastery_Brute.Focused_Accuracy': { effects: { accuracyBuff: { scale: 0.2, table: 'Melee_Ones' } } },
  'Epic.Sentinel_Mace_Mastery.Focused_Accuracy': { effects: { accuracyBuff: { scale: 2, table: 'Ranged_Buff_ToHit' } } },
  'Epic.Weapon_Mastery.Targeting_Drone': { effects: { accuracyBuff: { scale: 0.2, table: 'Melee_Ones' } } },
  'Epic.Weapon_Mastery_Stalker.Targeting_Drone': { effects: { accuracyBuff: { scale: 0.2, table: 'Melee_Ones' } } },
};
