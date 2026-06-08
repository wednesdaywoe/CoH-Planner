"""Binary-source the proc/global IO database (replaces hand-curated proc-data.ts).

PHASE 1 (globals): resolve always-on GLOBAL IO effects from the binary and validate
against the current hand PROC_DATABASE as oracle. The authoritative value for a global
lives in the granted `Set_Bonus.Global_Bonus.<Set>[_suffix]` power, NOT the boost
piece's `Null/Current` marker (Shield Wall marker=0.03 but real=0.05=5%). See
PROC-DATA-BINARY-SOURCING.md and the memory `global-io-values-from-globalbonus-powers`.

PHASE 2 (this file): emit structured `ProcEffect[]` per global piece to
`src/data/generated/proc-globals.generated.ts`, keyed by the PROC_DATABASE key, for the
consumer refactor (character-totals reads `.effects` instead of parsing mechanics).

Usage:
    py -3 scripts/extract-proc-data.py            # validate + emit HC global effects
    py -3 scripts/extract-proc-data.py --check     # validate only, no emit
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(PROJECT_ROOT / 'tools' / 'bin-crawler'))

from bin_crawler.parser._pigg import BinResolver
from bin_crawler.parser._boostsets import parse_boostsets
from bin_crawler.parser._powers import parse_powers, PowerRecord

HC_ASSETS = r'G:/Homecoming/assets/live'
PROC_DATA_TS = PROJECT_ROOT / 'src' / 'data' / 'proc-data.ts'
OUT_TS = PROJECT_ROOT / 'src' / 'data' / 'generated' / 'proc-globals.generated.ts'

# ---------------------------------------------------------------------
# Binary (attrib, aspect) -> structured ProcEffect {category, mult}.
# `category` matches ProcEffectCategory in proc-data.ts. `mult` converts the
# binary scale to the displayed value (×100 for %, ×10 for max HP, abs for KB).
# ---------------------------------------------------------------------
DMG_ATTRIBS = {'Smashing_Dmg', 'Lethal_Dmg', 'Fire_Dmg', 'Cold_Dmg',
               'Energy_Dmg', 'Negative_Energy_Dmg', 'Toxic_Dmg', 'Psionic_Dmg'}
DEF_ATTRIBS = {'Melee', 'Ranged', 'Area', 'Smashing', 'Lethal', 'Fire', 'Cold',
               'Energy', 'Negative_Energy', 'Psionic', 'Toxic', 'Base_Defense'}
MEZ_ATTRIBS = {'Held', 'Stunned', 'Sleep', 'Confused', 'Terrorized', 'Immobilized'}

ATTRIB_ASPECT_TO_EFFECT = {
    ('RechargeTime', 'Strength'): ('Recharge', 100.0),
    ('RunningSpeed', 'Current'):  ('RunSpeed', 100.0),
    ('RunningSpeed', 'Strength'): ('RunSpeed', 100.0),
    ('ToHit', 'Current'):         ('ToHit', 100.0),
    ('ToHit', 'Strength'):        ('ToHit', 100.0),
    ('Recovery', 'Current'):      ('Recovery', 100.0),
    ('Endurance', 'Strength'):    ('Recovery', 100.0),
    ('Endurance', 'Current'):     ('Endurance', 100.0),
    ('Regeneration', 'Current'):  ('Regeneration', 100.0),
    ('HitPoints', 'Strength'):    ('Regeneration', 100.0),
    ('HitPoints', 'Maximum'):     ('MaxHP', 10.0),
    ('Heal_Dmg', 'Absolute'):     ('Heal', 100.0),
    ('Absorb', 'Maximum'):        ('Absorb', 100.0),
    ('Absorb', 'Current'):        ('Absorb', 100.0),
    ('PerceptionRadius', 'Current'): ('Special', 100.0),
    ('Taunt', 'Resistance'):      ('Debuff', 100.0),
    ('RunningSpeed', 'Resistance'): ('SlowResistance', 100.0),
    ('FlyingSpeed', 'Resistance'):  ('SlowResistance', 100.0),
    ('RechargeTime', 'Resistance'): ('RechargeResistance', 100.0),
}

# Boost-piece Null-marker `tags` -> the effect category it stands for. Used to
# pick the right Global_Bonus power per piece in multi-global sets (Steadfast
# Def vs KB, Shield Wall Res vs Teleport).
TAG_TO_CATEGORY = {
    'Defense': 'Defense', 'Knock': 'KnockbackProtection', 'Res': 'Resistance',
    'rechargetime': 'Recharge', 'Movement': 'RunSpeed', 'Endurance': 'Recovery',
    'Heal': 'Heal', 'ToHit': 'ToHit',
}

# Globals the binary can't express as a plain (attrib, scale) — value comes from
# an HP-scaling expression or special mechanic. Hand-override to match the current
# planner behaviour (parity); revisit when the scaling model is improved.
SCALING_OVERRIDES = {
    # Reactive Defenses / Preventive Medicine: scaling +Res 3%–12.9% (planner
    # currently applies the 3% floor via parseProcEffect).
    'reactivedefenses': [{'category': 'Resistance', 'value': 3.0, 'effectType': 'All', 'scaling': True}],
    'preventivemedicine': [{'category': 'Absorb', 'value': 20.0, 'scaling': True}],
}


def _effect_type_for_defense(attribs: set[str]) -> str:
    return 'All' if DEF_ATTRIBS.issubset(attribs) or len(attribs & DEF_ATTRIBS) >= 8 else \
        '/'.join(sorted(attribs & DEF_ATTRIBS))


def _group_effects(eg) -> list[dict]:
    """Structured effects for ONE effect group (target/chance stamped by caller)."""
    out: list[dict] = []
    attset = set()
    for t in eg.templates:
        for a in (t.attribs or []):
            attset.add((a, t.aspect, round(t.scale, 5)))
    if not attset:
        return out
    attribs = {a for a, _, _ in attset}
    if DMG_ATTRIBS.issubset(attribs):
        asp = next(iter({asp for a, asp, _ in attset if a in DMG_ATTRIBS}))
        sc = next(iter({s for a, _, s in attset if a in DMG_ATTRIBS}))
        if asp == 'Resistance':
            out.append({'category': 'Resistance', 'value': round(abs(sc) * 100, 4), 'effectType': 'All'})
        elif asp == 'Strength':
            out.append({'category': 'Damage', 'value': round(abs(sc) * 250, 4), 'effectType': 'All'})
        return out
    if DEF_ATTRIBS & attribs:
        sc = next(iter({s for a, _, s in attset if a in DEF_ATTRIBS}))
        out.append({'category': 'Defense', 'value': round(abs(sc) * 100, 4),
                    'effectType': _effect_type_for_defense(attribs)})
        return out
    if MEZ_ATTRIBS.issubset(attribs):
        sc = next(iter({s for a, _, s in attset if a in MEZ_ATTRIBS}))
        out.append({'category': 'MezResist', 'value': round(abs(sc) * 100, 4), 'effectType': 'All'})
        return out
    if attribs & {'StealthRadius_PVE', 'StealthRadius_PVP'}:
        pve = next((s for a, _, s in attset if a == 'StealthRadius_PVE'), None)
        pvp = next((s for a, _, s in attset if a == 'StealthRadius_PVP'), None)
        ef = {'category': 'Stealth', 'value': round(pve if pve is not None else pvp, 4)}
        if pvp is not None:
            ef['valueMax'] = round(pvp, 4)
        out.append(ef)
        return out
    if attribs & {'Knockback', 'Knockup'}:
        sc = next(iter({s for a, _, s in attset if a in ('Knockback', 'Knockup')}))
        out.append({'category': 'KnockbackProtection', 'value': round(abs(sc), 4)})
        return out
    # single-attrib mapped effects — emit ALL distinct categories in the group
    # (Winter's Gift: SlowResistance AND RechargeResistance), not just the first.
    seen_cats: set[str] = set()
    for a, asp, sc in sorted(attset):
        cat = mult = eff_type = None
        if (a, asp) in ATTRIB_ASPECT_TO_EFFECT:
            cat, mult = ATTRIB_ASPECT_TO_EFFECT[(a, asp)]
        elif a in DMG_ATTRIBS and asp == 'Resistance':
            cat, mult, eff_type = 'Resistance', 100.0, a.replace('_Dmg', '')
        if cat and cat not in seen_cats:
            eff = {'category': cat, 'value': round(abs(sc) * mult, 4)}
            if eff_type:
                eff['effectType'] = eff_type
            out.append(eff)
            seen_cats.add(cat)
    if not out:
        out.append({'category': 'Special', 'raw': sorted(str(x) for x in attset)})
    return out


def structured_effects(power: PowerRecord) -> list[dict]:
    """Map a power's templates -> ProcEffect dicts, stamping target/chance so the
    consumer can exclude pet/ally buffs (target!=Self) and chance-gated procs."""
    out: list[dict] = []
    for eg in power.effects:
        effs = _group_effects(eg)
        if not effs:
            continue
        target = next((t.target for t in eg.templates if t.target), 'Self')
        chance = round(eg.chance, 4)
        for ef in effs:
            if target and target != 'Self':
                ef['target'] = 'pets'
            if chance < 0.999:
                ef['chance'] = chance
        out.extend(effs)
    return out


def _filtered_own(piece: PowerRecord) -> PowerRecord:
    """A view of the piece with only non-enhancement, non-marker templates."""
    groups = []
    for eg in piece.effects:
        # Exclude markers and ALL enhancement aspects (aspect=Strength, positive
        # scale) — a global's real effect uses Current/Absolute/Resistance/Maximum.
        # (Damage PROCS, which DO use Strength/Absolute damage, are a later phase.)
        keep = [t for t in eg.templates if t.attribs
                and t.attribs[0] not in ('Null', 'Grant_Power', 'Create_Entity', 'Set_Mode')
                and not (t.aspect == 'Strength' and t.scale > 0.001)]
        if keep:
            eg2 = type(eg).__new__(type(eg))
            eg2.__dict__.update(eg.__dict__)
            eg2.templates = keep
            groups.append(eg2)
    pv = type(piece).__new__(type(piece))
    pv.__dict__.update(piece.__dict__)
    pv.effects = groups
    return pv


def resolve_piece(piece: PowerRecord, set_name: str, gb_index: dict[str, PowerRecord]) -> tuple[list[dict], str]:
    """Resolve ONE global piece's effect. Tag-aware Global_Bonus selection for
    multi-global sets. Returns (effects, source)."""
    # collect markers (Null presence + tags) and explicit Grant_Power redirects
    grant_targets: list[str] = []
    marker_tags: list[str] = []
    has_null = False
    for eg in piece.effects:
        for t in eg.templates:
            if t.params and t.params.get('power_names'):
                grant_targets += [p for p in t.params['power_names'] if 'Bonus' in p]
            if t.attribs and t.attribs[0] == 'Null':
                has_null = True
                marker_tags += (eg.tags or [])
    # 1) explicit Grant_Power redirect
    for tgt in grant_targets:
        gp = gb_index.get(tgt) or gb_index.get(tgt.split('.')[-1])
        if gp:
            return structured_effects(gp), f'param->{tgt.split(".")[-1]}'
    # The piece's OWN non-enhancement effects (e.g. Impervious Skin's +Regen
    # rides alongside the Null marker that grants the mez-resist global).
    own = structured_effects(_filtered_own(piece))
    # 2) Null marker (even with empty tags) -> Global_Bonus by naming,
    #    disambiguated by the marker tag when present. Combine with own effects.
    if has_null:
        want = next((TAG_TO_CATEGORY[t] for t in marker_tags if t in TAG_TO_CATEGORY), None)
        cands = sorted((name for name in gb_index
                        if name == name.split('.')[-1]  # short keys only
                        and sid(name).startswith(sid(set_name)) and 'teleport' not in name.lower()),
                       key=len)
        chosen = None
        for c in cands:
            effs = structured_effects(gb_index[c])
            if effs and (want is None or effs[0]['category'] == want):
                chosen = (effs, c)
                break
        if chosen is None and cands:
            chosen = (structured_effects(gb_index[cands[0]]), cands[0])
        if chosen:
            gb_effs, c = chosen
            seen = {ef['category'] for ef in gb_effs}
            combined = gb_effs + [ef for ef in own if ef['category'] not in seen and ef['category'] != 'Special']
            return combined, f'name->{c}'
    # 3) own real-attrib templates (Kismet, Miracle, Numina, stealth, travel)
    return (own, 'own-templates') if own else ([], 'UNRESOLVED')


def resolve_set_global_effects(s, gb_index, pidx) -> dict[str, tuple[int, list[dict], str]]:
    """Resolve every global piece in a set -> {primary_category: (piece#, effects, src)}."""
    by_cat: dict[str, tuple[int, list[dict], str]] = {}
    for i, bl in enumerate(s.boostlists):
        pp = next((pidx[b] for b in bl.boosts if b in pidx), None)
        if not pp:
            continue
        effs, src = resolve_piece(pp, s.name, gb_index)
        # Register the piece under EACH of its effect categories so a hand entry
        # can find it by its primary category (e.g. Impervious Skin by Regeneration).
        for ef in (effs or []):
            by_cat.setdefault(ef['category'], (i + 1, effs, src))
    return by_cat


def infer_category(mech: str) -> str:
    """Infer a hand entry's PRIMARY effect category from its mechanics string."""
    m = mech.lower()
    if 'knock' in m and ('protection' in m or 'mag' in m):
        return 'KnockbackProtection'
    if 'resist(' in m and 'speed' in m:           # Winter's Gift slow/recharge resist
        return 'SlowResistance'
    if 'mez prot' in m:
        return 'Special'
    if 'defense' in m or '+def' in m:
        return 'Defense'
    if 'resistance' in m or '+res' in m:
        return 'Resistance'
    if 'maximum hit points' in m or 'max hp' in m:
        return 'MaxHP'
    if 'recharge' in m:
        return 'Recharge'
    if 'recovery' in m:
        return 'Recovery'
    if 'regeneration' in m:
        return 'Regeneration'
    if 'run speed' in m or 'runspeed' in m:
        return 'RunSpeed'
    if 'tohit' in m:
        return 'ToHit'
    if 'heal' in m or 'health' in m:
        return 'Heal'
    if 'absorb' in m or 'absorption' in m:
        return 'Absorb'
    if 'stealth' in m:
        return 'Stealth'
    return 'Special'


def parse_hand_globals() -> list[dict]:
    """Parse the hand PROC_DATABASE for Global / Proc120s entries (key + fields)."""
    txt = PROC_DATA_TS.read_text(encoding='utf-8')
    entries = []
    for m in re.finditer(
        r'"((?:[^"\\]|\\.)*)":\s*\{\s*\n\s*setCategory:\s*"[^"]*",\s*\n\s*'
        r'setName:\s*"([^"]+)",\s*\n\s*ioName:\s*"([^"]+)",\s*\n\s*ppm:\s*([^,]+),\s*\n\s*'
        r'mechanics:\s*"((?:[^"\\]|\\.)*)",\s*\n\s*pvpNotes:[^\n]*\n\s*type:\s*"(Global|Proc120s)"',
        txt):
        entries.append({'key': m.group(1), 'setName': m.group(2), 'ioName': m.group(3),
                        'ppm': m.group(4).strip(), 'mechanics': m.group(5), 'type': m.group(6)})
    return entries


def sid(n: str) -> str:
    return re.sub(r'[^a-z0-9]', '', n.lower())


def _emit_effect(ef: dict) -> str:
    parts = [f'category: "{ef["category"]}"']
    if ef.get('value') is not None:
        parts.append(f'value: {ef["value"]}')
    if ef.get('valueMax') is not None:
        parts.append(f'valueMax: {ef["valueMax"]}')
    if ef.get('effectType'):
        parts.append(f'effectType: "{ef["effectType"]}"')
    if ef.get('target'):
        parts.append(f'target: "{ef["target"]}"')
    if ef.get('chance') is not None:
        parts.append(f'chance: {ef["chance"]}')
    if ef.get('scaling'):
        parts.append('scaling: true')
    return '{ ' + ', '.join(parts) + ' }'


def main() -> int:
    emit = '--check' not in sys.argv[1:]
    print(f'Loading HC bins from {HC_ASSETS}…')
    r = BinResolver(HC_ASSETS)
    sets = parse_boostsets(r.read('boostsets.bin'))
    powers = parse_powers(r.read('powers.bin'))
    pidx = {p.full_name: p for p in powers}
    gb_index = {p.full_name: p for p in powers if p.full_name.startswith('Set_Bonus.Global_Bonus.')}
    for p in list(gb_index.values()):
        gb_index[p.full_name.split('.')[-1]] = p
    print(f'  {len(sets)} sets, {len(powers)} powers, '
          f'{len([k for k in gb_index if k.startswith("Set_Bonus")])} Global_Bonus powers')

    hand = parse_hand_globals()
    print(f'  {len(hand)} hand Global/Proc120s entries\n')

    SET_ALIASES = {'numinasconvalescence': 'numinasconvalesence'}
    set_by_id = {sid(s.name): s for s in sets}
    for hk, bk in SET_ALIASES.items():
        if bk in set_by_id:
            set_by_id[hk] = set_by_id[bk]

    generated: dict[str, list[dict]] = {}
    rows, n_match, n_diff, n_special, n_missing = [], 0, 0, 0, 0
    for e in hand:
        set_key = sid(e['setName'])
        if set_key in SCALING_OVERRIDES:
            generated[e['key']] = SCALING_OVERRIDES[set_key]
            rows.append(f'  [override] {e["key"]}')
            continue
        s = set_by_id.get(set_key)
        if not s:
            rows.append(f'  [NO BINARY SET] {e["key"]}  ({e["mechanics"][:40]})')
            n_missing += 1
            continue
        by_cat = resolve_set_global_effects(s, gb_index, pidx)
        want = infer_category(e['mechanics'])
        pick = by_cat.get(want)
        if not pick:
            # fall back to the set's sole / first global effect
            pick = next(iter(by_cat.values()), None)
        if not pick or all(ef['category'] == 'Special' for ef in pick[1]):
            generated[e['key']] = pick[1] if pick else [{'category': 'Special'}]
            n_special += 1
            rows.append(f'  [special] {e["setName"]:30s} want={want} GEN={pick[1] if pick else "[]"}')
            continue
        pnum, effs, src = pick
        # strip helper keys from emitted effects
        clean = [{k: v for k, v in ef.items() if k != 'raw'} for ef in effs]
        generated[e['key']] = clean
        gen_str = '; '.join(f'{ef["category"]}({ef.get("effectType","")} {ef.get("value")})'.replace('( ', '(')
                            for ef in clean)
        rows.append(f'  {e["setName"]:30s} #{pnum} want={want:18s} GEN: {gen_str}')

    print('\n'.join(rows))
    print(f'\n=== {len(generated)} entries generated; {n_special} special/no-op; {n_missing} missing set ===')

    if emit:
        OUT_TS.parent.mkdir(parents=True, exist_ok=True)
        lines = ['// AUTO-GENERATED by scripts/extract-proc-data.py — do not hand-edit.',
                 '// Structured always-on GLOBAL proc effects, binary-sourced from the HC bins',
                 '// (Set_Bonus.Global_Bonus.* powers). Keyed by PROC_DATABASE key. See',
                 '// PROC-DATA-BINARY-SOURCING.md.',
                 "import type { ProcEffect } from '@/data/proc-data';", '',
                 'export const PROC_GLOBAL_EFFECTS: Record<string, ProcEffect[]> = {']
        for key in sorted(generated):
            effs = generated[key]
            body = ', '.join(_emit_effect(ef) for ef in effs)
            esc = key.replace('\\', '\\\\').replace('"', '\\"')
            lines.append(f'  "{esc}": [{body}],')
        lines.append('};')
        OUT_TS.write_text('\n'.join(lines) + '\n', encoding='utf-8')
        print(f'Wrote {OUT_TS}')
    return 0


if __name__ == '__main__':
    sys.exit(main())
