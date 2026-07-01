import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describeChainTarget, describeTargetCap } from '@/utils/chain-expressions';

/**
 * Guards the two chain-power RPN expressions recovered from powers.bin
 * (fields 43b / 38 → `chainTargetExpression` / `maxTargetsExpression`) and the
 * Info-panel humanizers that render them. The oracle values are the HC dev's
 * `.powers` source — see parser_logs/BIN-PARSER-LOG.md ("Chain / max-targets
 * expression fields"). The Electrical Affinity circuits are the canonical
 * carriers: Rejuvenating = HP-priority, Energizing = End-priority, Empowering =
 * proximity-only; every circuit's cap grows with the Static buff.
 */
function gen(rel: string): string {
  const p = fileURLToPath(
    new URL(`./datasets/homecoming/generated/powersets/${rel}`, import.meta.url),
  );
  return fs.readFileSync(p, 'utf8');
}

const AFF = 'defender/primary/electrical-affinity';

describe('ChainTarget / MaxTargetsExpr survive the export→convert pipeline', () => {
  it('Rejuvenating Circuit: HP-priority ChainTarget + Static-scaled cap', () => {
    const t = gen(`${AFF}/rejuvenating-circuit.ts`);
    expect(t).toContain(
      '"chainTargetExpression": "101 kHitPoints% target> - enttype maintarget> enttype target> eq 99 * 1 + * 1 prevdistance / +"',
    );
    expect(t).toContain(
      '"maxTargetsExpression": "4 Redirects.Shock_Therapy.Shock_Therapy_Static source.ownPowerNum? 3 * +"',
    );
  });

  it('Energizing Circuit: Endurance-priority ChainTarget', () => {
    const t = gen(`${AFF}/energizing-circuit.ts`);
    expect(t).toContain('"chainTargetExpression": "101 kEndurance% target> -');
  });

  it('Empowering Circuit: proximity-only ChainTarget (no stat clause)', () => {
    const t = gen(`${AFF}/empowering-circuit.ts`);
    expect(t).toContain(
      '"chainTargetExpression": "enttype maintarget> enttype target> eq 99 * 1 + 1 prevdistance / +"',
    );
    expect(t).not.toContain('kHitPoints%');
    expect(t).not.toContain('kEndurance%');
  });

  it('a Tanker AoE melee attack carries the Gauntlet MaxTargetsExpr', () => {
    // Gauntlet raises the target cap on Tanker melee AoEs (bin field 38).
    const t = gen('tanker/secondary/battle-axe/cleave.ts');
    expect(t).toContain('"maxTargetsExpression":');
    expect(t).toMatch(/GauntletTargetCap/);
  });
});

describe('chain-expression humanizers', () => {
  it('describeChainTarget maps the circuit patterns', () => {
    const rej = '101 kHitPoints% target> - enttype maintarget> enttype target> eq 99 * 1 + * 1 prevdistance / +';
    const ene = '101 kEndurance% target> - enttype maintarget> enttype target> eq 99 * 1 + * 1 prevdistance / +';
    const emp = 'enttype maintarget> enttype target> eq 99 * 1 + 1 prevdistance / +';
    expect(describeChainTarget(rej)).toBe('Most-injured ally (lowest HP)');
    expect(describeChainTarget(ene)).toBe('Lowest-endurance ally');
    expect(describeChainTarget(emp)).toBe('Nearest target'); // proximity-only
    expect(describeChainTarget('some unknown tokens')).toBe('Weighted selection');
  });

  it('HP/End priority wins over the proximity tiebreaker in the same expression', () => {
    // The HP-priority expression also contains `prevdistance`; the stat clause
    // must be reported, not "Nearest target".
    expect(describeChainTarget('101 kHitPoints% ... prevdistance / +')).toBe('Most-injured ally (lowest HP)');
  });

  it('describeTargetCap distinguishes Static-stack vs Gauntlet vs generic', () => {
    expect(describeTargetCap('4 Redirects.Shock_Therapy.Shock_Therapy_Static source.ownPowerNum? 3 * +'))
      .toBe('Grows with Static stacks');
    expect(describeTargetCap('16 kDisable_GauntletTargetCap owner.Mode? 6 * -')).toBe('Raised by Gauntlet');
    expect(describeTargetCap('7 something? 2 * +')).toBe('Conditional');
  });
});
