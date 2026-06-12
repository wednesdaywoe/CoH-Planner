import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

/**
 * Rebirth stealth suppress-group (the "NictusFX" cross-server oracle).
 *
 * HC's Parse7 binary serializes the stealth mutual-suppression group as
 * stack="Suppress" + stack_key="NictusFX" (30 powers / 12 leaves). Rebirth's
 * older Parse6 format CANNOT express a global cross-power string key (its
 * stack_key is a per-power integer), so its stealth exports as Replace/null and
 * would over-count builds running 2+ suppress powers. The converter re-applies
 * the group by leaf name (STEALTH_SUPPRESS_LEAVES in convert-powerset.cjs) — a
 * no-op on HC. Members get stackKey "NictusFX" → max-wins; everything else
 * (Hide, Grant Invis, Mask Presence, IO procs) stays additive.
 *
 * Membership is binary-derived from the HC oracle; Mask Presence is NOT a member
 * (verified Replace/null 2026-06-12) and Hide is genuinely additive.
 */
function genRebirth(rel: string): string {
  const p = fileURLToPath(new URL(`./datasets/rebirth/generated/${rel}`, import.meta.url));
  return fs.readFileSync(p, 'utf8');
}
/** Pull the stackKey of the stealth effect block. `stackKey` is emitted only
 *  inside effects.stealth, so a direct match is unambiguous. */
function stealthStackKey(text: string): string | null {
  const m = text.match(/"stackKey"\s*:\s*"([^"]+)"/);
  return m ? m[1] : null;
}
function hasStealth(text: string): boolean {
  return /"stealth"\s*:\s*\{/.test(text);
}

describe('Rebirth stealth NictusFX suppress group', () => {
  it('a suppress-group toggle (Cloak of Darkness) carries stackKey "NictusFX"', () => {
    const t = genRebirth('powersets/brute/secondary/dark-armor/cloak-of-darkness.ts');
    expect(hasStealth(t)).toBe(true);
    expect(stealthStackKey(t)).toBe('NictusFX');
  });

  it('the three pool concealment powers (Stealth / Super Speed / Invisibility) are grouped', () => {
    const pools = genRebirth('power-pools.ts');
    // 3 NictusFX stackKeys in the pool data (Pool Stealth, Super Speed, Invisibility)
    expect((pools.match(/"stackKey"\s*:\s*"NictusFX"/g) || []).length).toBe(3);
  });

  it('Shadow Cloak (Warshade) is grouped', () => {
    expect(stealthStackKey(genRebirth('powersets/warshade/epic/umbral-aura/shadow-cloak.ts'))).toBe('NictusFX');
  });

  it('Stalker Hide is NOT grouped — it stacks additively (no stackKey)', () => {
    const t = genRebirth('powersets/stalker/secondary/ninjitsu/hide.ts');
    expect(hasStealth(t)).toBe(true);          // it does grant stealth
    expect(stealthStackKey(t)).toBeNull();     // but is additive, not NictusFX
  });
});
