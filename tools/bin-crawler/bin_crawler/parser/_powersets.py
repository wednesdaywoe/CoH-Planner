"""Parser for powersets.bin.

HC (Homecoming) Parse7 layout per record:
  string source, key, name
  u4 system, shared
  string display, help, short_help, icon
  string_array costume_keys, costume_parts
  string account_requires          <- present in most records, absent in 4
  [string extra1, extra2]          <- present only in 4 records (Wind_Control, Gadgetry, Utility_Belt)
  string_array buy_requires
  string buy_requires_failed
  u4 show_in_inventory, show_in_manage, show_in_info
  u4 specialize_at
  string_array specialize_requires
  string_array powers
  u4_array available
  ... (remaining fields skipped)

  Two layout variants:
    Primary: account_requires present, no extra strings (7573/7577 records)
    Fallback: account_requires absent, 2 extra strings (4 records: Wind_Control, Gadgetry, Utility_Belt)

Rebirth (retail i24) Parse6 layout per record:
  string source, key, name
  u4 system, shared
  string display, help, short_help, icon
  string_array costume_keys, costume_parts
  string account_tooltip, account_tooltip_phash, account_product  <- 3 retail fields
  string_array buy_requires
  string buy_requires_failed
  u4 show_in_inventory, show_in_manage, show_in_info
  u4 specialize_at
  string_array specialize_requires
  string_array powers
  u4_array vestigial_available (always empty)
  u4_array real_available (count == len(powers))
  u4_array unknown2..6 (5 more arrays, each count == len(powers))
  s4 terminal (-1)
"""

import sys
from pathlib import Path
from ._reader import open_parse7, BinReader, Parse6BinReader
from ._dataclasses import PowersetRecord


def parse_powersets(bin_path_or_data) -> list[PowersetRecord]:
    r = open_parse7(bin_path_or_data)
    is_parse6 = isinstance(r, Parse6BinReader)

    block_size = r.read_u4()
    count = r.read_u4()

    if is_parse6:
        layouts = [_parse_parse6]
    else:
        layouts = [_parse_primary, _parse_fallback]

    records = []
    fail_count = 0
    for i in range(count):
        rec_len = r.read_u4()

        rec = None
        for layout_fn in layouts:
            try:
                sub = r.sub_reader(rec_len)
                rec = layout_fn(sub)
                break
            except Exception:
                continue

        if rec is not None:
            records.append(rec)
        else:
            fail_count += 1

        r.skip(rec_len)

    if fail_count:
        print(f"  Powersets: {fail_count} records skipped", file=sys.stderr)

    return records


def _read_head(sub: BinReader):
    """Read the common header fields through costume_parts."""
    source = sub.read_string()
    key = sub.read_string()
    sub.read_string()               # name
    sub.read_u4()                   # system
    sub.read_u4()                   # shared
    display = sub.read_string()
    help_text = sub.read_string()
    short_help = sub.read_string()
    icon = sub.read_string()
    sub.read_string_array()         # costume_keys
    sub.read_string_array()         # costume_parts
    return {
        "source": source, "key": key, "display": display,
        "help": help_text, "short_help": short_help, "icon": icon,
    }


def _read_tail(sub: BinReader, head: dict) -> PowersetRecord:
    """Read buy_requires through available and build record (HC Parse7)."""
    sub.read_string_array()         # buy_requires
    sub.read_string()               # buy_requires_failed
    sub.read_u4()                   # show_in_inventory
    sub.read_u4()                   # show_in_manage
    sub.read_u4()                   # show_in_info
    sub.read_u4()                   # specialize_at
    sub.read_string_array()         # specialize_requires
    powers = sub.read_string_array()
    available = sub.read_u4_array()

    # Validate layout correctness
    if len(available) != len(powers):
        raise ValueError(
            f"available/powers mismatch: {len(available)} != {len(powers)}"
        )
    if powers and not all("." in p for p in powers):
        raise ValueError("power names missing dots")

    return PowersetRecord(
        source=head["source"],
        key=head["key"],
        display_name=head["display"],
        help=head["help"],
        short_help=head["short_help"],
        icon=head["icon"],
        powers=powers,
        available=available,
    )


def _parse_primary(sub: BinReader) -> PowersetRecord:
    """Primary layout: account_requires, no extra strings."""
    head = _read_head(sub)
    sub.read_string()               # account_requires
    return _read_tail(sub, head)


def _parse_fallback(sub: BinReader) -> PowersetRecord:
    """Fallback: no account_requires, 2 extra strings before buy_requires."""
    head = _read_head(sub)
    sub.read_string()               # extra string 1
    sub.read_string()               # extra string 2
    return _read_tail(sub, head)


def _parse_parse6(sub: BinReader) -> PowersetRecord:
    """Parse6 (retail/Rebirth) layout: 3 account strings + extended tail."""
    head = _read_head(sub)

    # Retail account fields (HC replaced with account_requires)
    sub.read_string()               # account_tooltip
    sub.read_string()               # account_tooltip_phash
    sub.read_string()               # account_product

    sub.read_string_array()         # buy_requires
    sub.read_string()               # buy_requires_failed
    sub.read_u4()                   # show_in_inventory
    sub.read_u4()                   # show_in_manage
    sub.read_u4()                   # show_in_info
    sub.read_u4()                   # specialize_at
    sub.read_string_array()         # specialize_requires
    powers = sub.read_string_array()

    # Parse6 tail: empty vestigial available + real available + 5 more arrays + terminal
    sub.read_u4_array()             # vestigial available (always empty)
    available = sub.read_u4_array()  # real available (count == len(powers))

    # Validate
    if len(available) != len(powers):
        raise ValueError(
            f"available/powers mismatch: {len(available)} != {len(powers)}"
        )
    if powers and not all("." in p for p in powers):
        raise ValueError("power names missing dots")

    # Skip remaining arrays and terminal
    sub.skip_to_end()

    return PowersetRecord(
        source=head["source"],
        key=head["key"],
        display_name=head["display"],
        help=head["help"],
        short_help=head["short_help"],
        icon=head["icon"],
        powers=powers,
        available=available,
    )
