import { describe, it, expect } from 'vitest';
import { PROC_DATABASE } from '@/data/proc-data';
import { PROC_DAMAGE_EFFECTS } from '@/data/generated/proc-damage.generated';

/**
 * Transitional guard (Phase 3): binary-sourced damage proc N-M ranges
 * (scale × Melee_ProcDamage at L1/L50) must match the hand mechanics
 * "Damage(Type N - M)" — except an allowlist of confirmed corrections where the
 * hand data was inconsistent (some ATO procs entered as a flat level-50 value
 * instead of the scaling 1-50 range; Ice Mistral's min was wrong for its scale).
 * See PROC-DATA-BINARY-SOURCING.md.
 */
const ALLOWLIST = new Set([
  'Chance for Cold Damage',   // Ice Mistral's Torment: hand N=10 wrong for scale 0.67 → 7
  "Blaster's Wrath: Recharge/Chance for Fire Damage",            // hand flat 72-72 → 7-72
  "Superior Blaster's Wrath: Recharge/Chance for Fire Damage",   // hand flat 107-107 → 10-107
  'Malice of the Corruptor: Recharge/Chance for Negative Energy Damage',
  'Superior Malice of the Corruptor: Recharge/Chance for Negative Energy Damage',
  'Will of the Controller: Recharge/Chance for Psionic Damage',
  'Superior Will of the Controller: Recharge/Chance for Psionic Damage',
]);

const HAND = /Damage\s*\(\s*[\w ]+?\s+(\d+)(?:\s*-\s*(\d+))?\s*\)/;

describe('damage proc structured-vs-mechanics parity', () => {
  const unexpected: string[] = [];
  for (const [key, effects] of Object.entries(PROC_DAMAGE_EFFECTS)) {
    const entry = PROC_DATABASE[key];
    if (!entry) { unexpected.push(`missing entry: ${key}`); continue; }
    const m = entry.mechanics.match(HAND);
    if (!m) { unexpected.push(`hand mechanics not Damage(...): ${key} -> ${entry.mechanics}`); continue; }
    const handN = parseInt(m[1], 10);
    const handM = m[2] ? parseInt(m[2], 10) : handN;
    const e = effects[0];
    if ((e.value !== handN || e.valueMax !== handM) && !ALLOWLIST.has(key)) {
      unexpected.push(`${key}\n  hand: ${handN}-${handM}  gen: ${e.value}-${e.valueMax}`);
    }
  }

  it('damage N-M matches hand except known corrections', () => {
    expect(unexpected, `Unexpected damage parity diffs:\n${unexpected.join('\n')}`).toEqual([]);
  });
});
