#!/usr/bin/env python3
"""Dump raw template bytes for a specific power by instrumenting the parser.

Usage:
  py -3 dump_template_bytes.py <power_full_name> [--assets-dir ...]
"""
import argparse
import struct
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from bin_crawler.parser import _powers as P
from bin_crawler.parser._pigg import BinResolver


def hex_groups(data: bytes, per_line: int = 16) -> str:
    out = []
    for i in range(0, len(data), per_line):
        chunk = data[i:i+per_line]
        hexpart = ' '.join(f'{b:02x}' for b in chunk)
        asc = ''.join(chr(b) if 32 <= b < 127 else '.' for b in chunk)
        out.append(f'  {i:04x}  {hexpart:<{per_line*3}}  {asc}')
    return '\n'.join(out)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('power', help='power full_name to dump')
    ap.add_argument('--assets-dir', default=r'G:\Homecoming\assets\live')
    args = ap.parse_args()

    target = args.power.lower()
    captured = []  # list of (power_full_name, [tmpl_bytes, ...])
    current_power = {'name': None}

    # Wrap _parse_effect_group so it grabs each template's raw bytes BEFORE calling the real parser.
    real_peg = P._parse_effect_group
    real_pp  = P._parse_power

    def wrapped_power(r, *, has_field_45b=True, has_field_41b=False):
        rec_start = r._pos
        # Read full_name to know whether to capture
        peek_reader_pos = r._pos
        # We need to peek the first string without consuming. Use sub-reader of remaining.
        return real_pp(r, has_field_45b=has_field_45b, has_field_41b=has_field_41b)

    def wrapped_group(r):
        # Mirror the header reads to reach the template struct_array
        pre1 = r.read_u4(); pre2 = r.read_u4()
        for _ in range(5): r.read_f4()
        r.read_string_array()
        flags_val = r.read_u4(); eval_flags = r.read_u4()

        tmpl_count = r.read_u4()
        tmpls_bytes = []
        # We need to dump bytes AND still produce a real EffectGroup.
        # So: read bytes, then hand a fresh sub_reader to _parse_effect_template.
        from bin_crawler.parser._dataclasses import EffectGroup
        templates = []
        for _ in range(tmpl_count):
            tmpl_len = r.read_u4()
            tmpl_start = r._pos
            tmpl_bytes = bytes(r._data[tmpl_start:tmpl_start + tmpl_len])
            tmpls_bytes.append(tmpl_bytes)
            tmpl_reader = r.sub_reader(tmpl_len)
            try:
                t = P._parse_effect_template(tmpl_reader)
                templates.append(t)
            except Exception:
                pass
            r.skip(tmpl_len)

        if current_power['name'] and current_power['name'].lower() == target:
            # Also capture the "tail" — bytes in the effect group AFTER templates.
            tail_start = r._pos
            tail_end = r._end
            tail_bytes = bytes(r._data[tail_start:tail_end])
            captured.append((tmpls_bytes, tail_bytes))

        r.skip_to_end()

        from bin_crawler.parser._enums import PVP_FLAG
        is_pvp = PVP_FLAG.get(flags_val, 'EITHER')
        return EffectGroup(
            chance=0.0, ppm=0.0, delay=0.0, radius_inner=0.0, radius_outer=0.0,
            requires_expression='', flags=[], is_pvp=is_pvp,
            eval_flags=eval_flags, templates=templates,
        )

    # Also intercept _parse_power to record which power is being parsed
    def wrapped_parse_power(r, *, has_field_45b=True, has_field_41b=False):
        pos0 = r._pos
        # Peek the first string (full_name) without fully consuming the record.
        first_name_offset = struct.unpack_from('<I', r._data, pos0)[0]
        # Resolve the string offset using the reader's string table.
        name = ''
        try:
            strtab_base = r._strtab_base
            addr = strtab_base + first_name_offset
            end = addr
            while end < len(r._data) and r._data[end] != 0:
                end += 1
            name = bytes(r._data[addr:end]).decode('utf-8', errors='replace')
        except Exception:
            pass
        current_power['name'] = name
        return real_pp(r, has_field_45b=has_field_45b, has_field_41b=has_field_41b)

    P._parse_effect_group = wrapped_group
    P._parse_power = wrapped_parse_power

    resolver = BinResolver(args.assets_dir)
    print('Parsing powers.bin (~1-3 min)...', flush=True)
    powers = P.parse_powers(resolver.read('powers.bin'))
    print(f'  parsed {len(powers)} powers', flush=True)

    if not captured:
        print(f'  power {args.power!r} not found or had no effect groups')
        return

    print(f'\n=== Raw template bytes for {args.power} ===')
    for gi, (group, tail) in enumerate(captured):
        print(f'\n-- effect group {gi} ({len(group)} templates, tail={len(tail)} bytes) --')
        for ti, tb in enumerate(group):
            print(f'\n  template {ti} ({len(tb)} bytes):')
            print(hex_groups(tb))
        if tail:
            print(f'\n  TAIL ({len(tail)} bytes) — bytes after templates array:')
            print(hex_groups(tail))


if __name__ == '__main__':
    main()
