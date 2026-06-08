import { describe, it, expect } from 'vitest';
import { PROC_DATABASE } from '@/data/proc-data';
import type { ProcEffect } from '@/data/proc-data';

/**
 * Guard: the binary-sourced always-on GLOBAL effects keep their verified
 * dashboard values. Replaces the transitional parseProcEffect-oracle parity test
 * (retired with parseProcEffect, P6) with a self-contained snapshot of canonical
 * globals across every dashboard category. A diff means the generator regressed
 * or a real value changed (update the snapshot after verifying in-game).
 * See PROC-DATA-BINARY-SOURCING.md.
 */

// key -> the structured effects it must contain (category/value[/effectType]).
const CANONICAL: Record<string, Array<Pick<ProcEffect, 'category' | 'value' | 'effectType'>>> = {
  '+Def(All)': [{ category: 'Defense', value: 3.0, effectType: 'All' }],            // Steadfast / Gladiator
  'Buff Recharge': [{ category: 'Recharge', value: 7.5 }],                          // Luck of the Gambler
  'Buff Recovery & Regeneration': [                                                 // Numina's
    { category: 'Recovery', value: 10.0 },
    { category: 'Regeneration', value: 20.0 },
  ],
  'Max HP': [{ category: 'MaxHP', value: 7.5 }],                                    // Unbreakable Guard (+MaxHP, not Res)
  'Aegis: Psionic and Mez Resistance': [
    { category: 'Resistance', value: 5.0, effectType: 'Psionic' },
    { category: 'MezResist', value: 20.0, effectType: 'All' },
  ],
  'Resist Speed and Recharge Debuffs': [                                            // Winter's Gift
    { category: 'SlowResistance', value: 20.0 },
    { category: 'RechargeResistance', value: 20.0 },
  ],
  'Scaling +Res(All)': [{ category: 'Resistance', value: 3.0, effectType: 'All' }], // Reactive Defenses (scaling floor)
  'Impervium Armor: +Res(Psionic)': [{ category: 'Resistance', value: 6.0, effectType: 'Psionic' }], // 5->6 correction
};

describe('canonical global proc effect values', () => {
  for (const [key, expected] of Object.entries(CANONICAL)) {
    it(`${key} keeps its verified structured effects`, () => {
      const effects = PROC_DATABASE[key]?.effects ?? [];
      for (const want of expected) {
        const hit = effects.find(
          (e) => e.category === want.category && e.value === want.value &&
            (want.effectType === undefined || e.effectType === want.effectType),
        );
        expect(hit, `${key}: expected ${JSON.stringify(want)} in ${JSON.stringify(effects)}`).toBeDefined();
      }
    });
  }
});
