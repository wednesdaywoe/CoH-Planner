import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

/**
 * Pseudo-pet summon entity resolution.
 *
 * Location / rain / patch powers (Glue Arrow, Rain of Fire, Caltrops, …) deal
 * their damage and debuffs through a summoned pseudo-pet, not the parent power.
 * The HC binary leaves the EntCreate `entity_def` as an opaque P-hash
 * (e.g. P4234428342); the real pet is named by `priority_list`. The converter
 * (convert-powerset.cjs) resolves single-entity summons to that name so the
 * planner can look the pet up in PET_ENTITIES and surface its effects — left as
 * a P-hash, the lookup fails and the power shows no damage/debuffs (the Glue
 * Arrow report). Multi-entity summons (Phantom Army, Gremlins) are intentionally
 * left alone so their template-count semantics aren't disturbed.
 *
 * Guards that these powers' summon entity is a resolvable pet name, not a P-hash.
 */
const HC = fileURLToPath(new URL('./datasets/homecoming/generated/powersets', import.meta.url));

function summonEntity(file: string): string | null {
  const text = fs.readFileSync(`${HC}/${file}`, 'utf8');
  const m = text.match(/"summon":\s*\{[^}]*?"entity":\s*"([^"]+)"/s);
  return m ? m[1] : null;
}

describe('pseudo-pet summon entity resolution (homecoming)', () => {
  it.each([
    ['Glue Arrow', 'blaster/secondary/tactical-arrow/glue-arrow.ts', 'Pets_StickyArrow_Blaster'],
    ['Caltrops', 'blaster/secondary/devices/caltrops.ts', 'Pets_Caltrops'],
    ['Rain of Fire', 'blaster/primary/fire-blast/rain-of-fire.ts', 'Pets_RainofFire'],
    ['Blizzard', 'blaster/primary/ice-blast/blizzard.ts', 'Pets_Blizzard'],
  ])('%s resolves its summon to the real pet (not a P-hash)', (_name, file, expected) => {
    const entity = summonEntity(file);
    expect(entity).toBe(expected);
    expect(entity).not.toMatch(/^P\d+$/);
  });
});
