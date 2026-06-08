import { describe, it, expect } from 'vitest';
import { PROC_DATABASE, parseProcEffect } from '@/data/proc-data';
import { PROC_GLOBAL_EFFECTS } from '@/data/generated/proc-globals.generated';

/**
 * Transitional guard (Phase 2): the binary-sourced structured global effects must
 * reproduce the same PLAYER-dashboard contributions as the legacy
 * parseProcEffect(mechanics) path — except a short allowlist of intentional
 * binary corrections/completions. A NEW diff means the generator regressed (or a
 * real correction to add to the allowlist). Retire this once parseProcEffect is
 * gone (P6). See PROC-DATA-BINARY-SOURCING.md.
 */

// Categories applySingleProcEffect actually applies to the dashboard.
const DASH = new Set(['Recovery', 'Regeneration', 'Endurance', 'Heal', 'MaxHP', 'Defense',
  'Resistance', 'ToHit', 'Recharge', 'RunSpeed', 'MezResist', 'SlowResistance',
  'RechargeResistance', 'KnockbackProtection']);
// effectType only changes routing for Defense/Resistance (All vs typed); ignored elsewhere.
const TYPE_MATTERS = new Set(['Defense', 'Resistance']);

// Intentional binary corrections/completions (verified): key -> reason.
const ALLOWLIST = new Set([
  'Impervium Armor: +Res(Psionic)',                  // 5% -> 6% (confirmed in-game)
  'Impervious Skin: +Regeneration/+Res Mez(All)',    // binary adds the +MezResist the hand string omitted
  'Thrust: Run/+Run Speed',                          // hand had no value; binary fills +10% Run
]);

const norm = (c: string, v?: number, t?: string) =>
  `${c}:${v}${TYPE_MATTERS.has(c) && t ? `:${t.toLowerCase()}` : ''}`;

describe('proc global structured-vs-legacy dashboard parity', () => {
  const unexpected: string[] = [];
  for (const key of Object.keys(PROC_GLOBAL_EFFECTS)) {
    const entry = PROC_DATABASE[key];
    if (!entry) { unexpected.push(`missing PROC_DATABASE entry: ${key}`); continue; }
    const p = parseProcEffect(entry.mechanics);
    const oldSet = new Set<string>();
    if (p.value !== undefined && DASH.has(p.category)) oldSet.add(norm(p.category, p.value, p.effectType));
    if (p.secondaryCategory && p.secondaryValue !== undefined && DASH.has(p.secondaryCategory))
      oldSet.add(norm(p.secondaryCategory, p.secondaryValue, p.secondaryEffectType));
    const newSet = new Set<string>();
    for (const e of entry.effects ?? []) {
      if (e.target === 'pets') continue;
      if (e.chance !== undefined && e.chance < 1) continue;
      if (e.value !== undefined && DASH.has(e.category)) newSet.add(norm(e.category, e.value, e.effectType));
    }
    const differs = [...oldSet].some((x) => !newSet.has(x)) || [...newSet].some((x) => !oldSet.has(x));
    if (differs && !ALLOWLIST.has(key)) {
      unexpected.push(`${key}\n  old: ${[...oldSet].join(', ') || '(none)'}\n  new: ${[...newSet].join(', ') || '(none)'}`);
    }
  }

  it('has no dashboard parity diffs outside the known-corrections allowlist', () => {
    expect(unexpected, `Unexpected proc-global parity diffs:\n${unexpected.join('\n')}`).toEqual([]);
  });
});
