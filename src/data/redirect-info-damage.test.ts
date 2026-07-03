import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

/**
 * Regression guard for `*_Info` display-damage resolution (convert-powerset
 * `collectInfoRedirectTemplates`).
 *
 * Remote Bomb (Blaster Devices + all Traps ATs) is a pure mode-conditional
 * redirect shell: the player power has no effects, and its Self/Target/detonation
 * redirects carry only a scale-0 placeholder + the bomb-pet summon. The game's
 * player-facing damage lives on a `<name>_Info` / `_Blaster_Info` power
 * (`show_in_info`, condition `'0'`). The converter now follows that when the
 * mechanical redirect produced no damage, stripping the redundant
 * `arch source> Class_<AT>` selector and the PvP `enttype` KB variant, and
 * bypassing the Fiery-Embrace-bonus heuristic (which would wrongly strip the
 * genuine base Fire damage). See HOMECOMING_PARSER.
 */
function gen(dataset: string, rel: string): string {
  const p = fileURLToPath(new URL(`./datasets/${dataset}/generated/powersets/${rel}`, import.meta.url));
  return fs.readFileSync(p, 'utf8');
}

describe('Remote Bomb surfaces its _Info display damage', () => {
  it('Blaster Devices: Fire 2.0 + Lethal 3.0 + KB 4 (not Fire-stripped, KB not doubled)', () => {
    const t = gen('homecoming', 'blaster/secondary/devices/time-bomb.ts');
    expect(t).toMatch(/"type":\s*"Fire",\s*"scale":\s*2\b/);   // Fire kept (FE heuristic bypassed)
    expect(t).toMatch(/"type":\s*"Lethal",\s*"scale":\s*3\b/);
    // KB from the PvE branch only — the PvP enttype copy is dropped, so not 8.
    expect(t).toMatch(/"knockback":\s*\{\s*"scale":\s*4\b/);
    expect(t).not.toMatch(/"knockback":\s*\{\s*"scale":\s*8\b/);
  });

  it('Traps (Defender) Time Bomb also surfaces its damage', () => {
    const t = gen('homecoming', 'defender/primary/traps/time-bomb.ts');
    expect(t).toContain('"damage"');
    expect(t).toMatch(/"type":\s*"Fire"/);
  });
});
