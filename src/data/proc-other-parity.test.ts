import { describe, it, expect } from 'vitest';
import { PROC_DATABASE } from '@/data/proc-data';
import { PROC_OTHER_EFFECTS } from '@/data/generated/proc-effects.generated';

/**
 * Transitional guard (Phase 3b): the dashboard-relevant non-global proc payloads
 * (Endurance/Recovery/Regeneration → applyPPMProcBonuses) must match the hand
 * mechanics value, except confirmed corrections. Foe debuff/mez/knock effects are
 * display-only (no dashboard impact) and not value-checked here. Retire with
 * parseProcEffect (P6). See PROC-DATA-BINARY-SOURCING.md.
 */
const DASH = ['Endurance', 'Recovery', 'Regeneration'] as const;
const ALLOWLIST = new Set([
  'Chance for Endurance Buff',   // Performance Shifter: binary 10% vs hand 7.5% (binary correct)
]);

function handValue(mech: string, cat: string): number | null {
  const m = mech.match(new RegExp(`${cat}\\s+(\\d+(?:\\.\\d+)?)\\s*%`, 'i'));
  return m ? parseFloat(m[1]) : null;
}

describe('non-global proc dashboard-value parity', () => {
  const unexpected: string[] = [];
  let checked = 0;
  for (const [key, effects] of Object.entries(PROC_OTHER_EFFECTS)) {
    const entry = PROC_DATABASE[key];
    if (!entry) { unexpected.push(`missing entry: ${key}`); continue; }
    for (const e of effects) {
      if (!DASH.includes(e.category as typeof DASH[number])) continue;
      const hv = handValue(entry.mechanics, e.category);
      if (hv === null) continue; // hand string has no % number (e.g. flat HP) — skip
      checked++;
      if (e.value !== hv && !ALLOWLIST.has(key)) {
        unexpected.push(`${key} [${e.category}]\n  hand: ${hv}  gen: ${e.value}  (${entry.mechanics})`);
      }
    }
  }

  it('checked at least a few dashboard-relevant procs', () => {
    expect(checked).toBeGreaterThan(2);
  });
  it('dashboard proc values match hand except known corrections', () => {
    expect(unexpected, `Unexpected non-global proc parity diffs:\n${unexpected.join('\n')}`).toEqual([]);
  });
});
