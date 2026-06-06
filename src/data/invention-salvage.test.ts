import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { INVENTION_SALVAGE_REGISTRY } from '@/data/generated/invention-salvage.generated';

/**
 * Invention salvage is binary-sourced from salvage.bin (binary category
 * "Invention") via export_salvage.py → convert-salvage.cjs →
 * generated/invention-salvage.generated.ts. This guard asserts the committed
 * registry still matches the committed export and is well-formed, so a stale
 * generated file or a parser regression can't silently diverge it. salvage.bin
 * is HC-only (Rebirth has none).
 */
const RARITIES = new Set(['common', 'uncommon', 'rare']);

function exportInvention() {
  const p = fileURLToPath(new URL('../../exported_powers/salvage.json', import.meta.url));
  return JSON.parse(fs.readFileSync(p, 'utf8')).salvage.filter(
    (s: { category: string }) => s.category === 'invention',
  );
}

describe('invention salvage is binary-sourced', () => {
  const reg = INVENTION_SALVAGE_REGISTRY;
  const entries = Object.values(reg);

  it('matches the committed salvage.bin export (count + rarities)', () => {
    const exp = exportInvention();
    expect(entries.length).toBe(exp.length);
    const byId = new Map(exp.map((s: { name: string; rarity: string }) => [
      s.name.replace(/^S_/, ''),
      s.rarity,
    ]));
    for (const s of entries) {
      expect(byId.get(s.id), `${s.id} missing in export`).toBe(s.rarity);
    }
  });

  it('is well-formed (non-empty, valid rarities, id===key)', () => {
    expect(entries.length).toBeGreaterThan(50);
    for (const [key, s] of Object.entries(reg)) {
      expect(s.id).toBe(key);
      expect(s.displayName.length).toBeGreaterThan(0);
      expect(RARITIES.has(s.rarity), `${s.id} bad rarity ${s.rarity}`).toBe(true);
    }
  });

  it('contains known current invention salvage', () => {
    // Spot-check items whose rarity is well-known, guarding the rarity field.
    expect(reg.Boresight?.rarity).toBe('common');
    expect(reg.DeificWeapon?.rarity).toBe('rare');
  });
});
