import { describe, it, expect, beforeAll } from 'vitest';
import { loadDataset } from '@/data/dataset';
import { getPowerset } from '@/data';
import type { Power } from '@/types';

/**
 * Bio Armor's "Evolving Armor" (internal `Adaptation`) grants a per-foe defense
 * bonus ONLY while in Defensive Adaptation and a per-foe regen/recovery bonus
 * ONLY while in Efficient (`rested`) Adaptation. In the binary these ride
 * `kDefensiveAdaptation Source.Mode?` / `kRestedAdaptation Source.Mode?` gated
 * effect groups.
 *
 * The converter's per-target/stacking pass historically ignored the mode gate
 * and folded those Replace+Continuous scales into the ALWAYS-ON base effects, so
 * Evolving Armor granted defense (and regen/recovery) in every stance, while the
 * matching stance conditional carried only the bare per-foe increment (badly
 * understated). These tests pin the fix:
 *
 *   1. Base `effects` carry NO defenseBuff / regenBuff / recoveryBuff (they are
 *      stance-gated), but DO keep the always-on resistance.
 *   2. The Defensive conditional carries the full defense (base+perFoe, ~0.42
 *      smashing scale with a perTarget), and the Efficient conditional carries
 *      the per-foe regen/recovery (on the unenhanceable keys).
 */

// Look up by DISPLAY name: the +Res/per-foe toggle is internally "Adaptation" on
// Scrapper/Brute/Tanker but "Adaptation" is the STANCE SWITCHER on Stalker/
// Sentinel (which lack an Evolving Armor toggle entirely — they run Hide). The
// display name is unambiguous and returns undefined where the power is absent.
function evolvingArmor(setId: string): Power | undefined {
  return getPowerset(setId)?.powers.find((p) => p.name === 'Evolving Armor');
}

function conditional(power: Power, id: string) {
  return (power.conditionalEffects ?? []).find((c) => c.id === id);
}

const AT_SETS = [
  'scrapper/bio-armor',
  'brute/bio-armor',
  'tanker/bio-armor',
  'stalker/bio-armor',
  'sentinel/bio-armor',
];

for (const ds of ['homecoming', 'rebirth'] as const) {
  describe(`Evolving Armor stance-gating — ${ds}`, () => {
    beforeAll(async () => {
      await loadDataset(ds);
    });

    for (const setId of AT_SETS) {
      it(`${setId}: base effects do NOT leak stance-gated defense/regen/recovery`, () => {
        const power = evolvingArmor(setId);
        if (!power) return; // some ATs may be absent in a given dataset
        const effects = power.effects ?? {};
        // Stance-gated — must not be always-on in base.
        expect(effects.defenseBuff, `${setId} base defenseBuff (Defensive-only)`).toBeUndefined();
        expect(effects.regenBuff, `${setId} base regenBuff (Efficient-only)`).toBeUndefined();
        expect(effects.recoveryBuff, `${setId} base recoveryBuff (Efficient-only)`).toBeUndefined();
        // The always-on resistance survives (Evolving Armor's base +Res).
        expect(effects.resistance, `${setId} base resistance (always-on)`).toBeTruthy();
      });

      it(`${setId}: Defensive conditional carries the full per-foe defense`, () => {
        const power = evolvingArmor(setId);
        if (!power) return;
        const def = conditional(power, 'defensiveadaptation');
        expect(def, `${setId} defensiveadaptation conditional`).toBeTruthy();
        const smashing = (def!.effects as Record<string, any>)?.defenseBuff?.smashing;
        expect(smashing, `${setId} Defensive defenseBuff.smashing`).toBeTruthy();
        // Full value = base (Replace) + per-foe (Continuous) — an order of
        // magnitude above the bare per-foe increment the old bug surfaced.
        expect(smashing.scale, `${setId} Defensive smashing scale`).toBeGreaterThan(0.3);
        expect(smashing.perTarget, `${setId} Defensive smashing perTarget`).toBeGreaterThan(0);
      });

      it(`${setId}: Efficient conditional carries per-foe regen/recovery`, () => {
        const power = evolvingArmor(setId);
        if (!power) return;
        const eff = conditional(power, 'restedadaptation');
        expect(eff, `${setId} restedadaptation conditional`).toBeTruthy();
        const e = eff!.effects as Record<string, any>;
        const regen = e?.regenBuffUnenhanced ?? e?.regenBuff;
        const recovery = e?.recoveryBuffUnenhanced ?? e?.recoveryBuff;
        expect(regen, `${setId} Efficient regen`).toBeTruthy();
        expect(recovery, `${setId} Efficient recovery`).toBeTruthy();
        expect(regen.perTarget, `${setId} Efficient regen perTarget`).toBeGreaterThan(0);
        expect(recovery.perTarget, `${setId} Efficient recovery perTarget`).toBeGreaterThan(0);
      });
    }
  });
}
