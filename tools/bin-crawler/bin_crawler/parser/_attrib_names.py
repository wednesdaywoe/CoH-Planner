"""Parse the mode-name table out of ``attrib_names.bin``.

Background
----------
A ``Set_Mode`` AttribMod's ``magnitude`` field is not a stat value — it is a
1-based index into the game's global **mode** registry (the ``ppchMode``
sub-array of the ``AttribNames`` struct in ``attrib_names.bin``). In the
human-readable ``.powers`` source that index is written as the mode token
itself, e.g. ``Magnitude kDomination_Active`` / ``Magnitude kGranite_Mode``.
The compiled bin stores the resolved index (``Domination_Active`` -> 47),
which is opaque without this table.

``attrib_names.bin`` is otherwise never read by the parser (``ATTRIB_NAME`` in
``_enums.py`` is a hand-maintained dict); this module is the sole consumer.

Binary layout
-------------
Parse7 ``CrypticS`` header + string table, then the ``AttribNames`` struct
(a length-prefixed sequence of sub-arrays: Damage / Defense / Boost / Group /
**Mode** / ...). The mode sub-array is a run of fixed 16-byte records::

    u4 flag (0)   u4 type (12)   str name (offset)   str display (offset)

where ``name`` is a C-identifier mode token (``Domination``, ``Granite_Mode``,
``DefensiveAdaptation``) and ``display`` is its human label (``Domination``,
``Granite Form``, ...). We locate the mode array as the longest contiguous run
of such records (the ``type==12`` + identifier-name shape is distinctive). The
``Set_Mode`` magnitude is a direct index into that run — its first record
(index 0) is the ``ServerTrayOverride`` system slot, so ``Peacebringer_Blaster_Mode``
is 1, ``Domination`` 45, ``Domination_Active`` 46, ``RestedAdaptation`` 153.

Verification (HC, ``assets/live`` 2026): 214 records (indices 0..213); broad
cross-check against the authoritative ``.powers`` oracle resolved **183/184**
``Set_Mode`` templates (mag>=2) to the exact oracle mode token (the 1 outlier is
a mode that postdates the oracle snapshot, not a mapping error). Mode indices are
**per-server** — each server's ``attrib_names.bin`` reorders them, so parse the
table from the same source you parsed ``powers.bin`` from.

Note on mag==1: mode #1 (``Peacebringer_Blaster_Mode``) is the only mode at
index 1, and it collides with an unrelated parser artifact — attrib index 118 is
a shared "special" slot, so ``kXPDebtProtection`` / ``kSetCostume`` templates
also decode as ``Set_Mode`` with a placeholder ``magnitude`` of 1. Callers that
resolve modes should therefore gate on ``magnitude >= 2`` to stay clear of that
ambiguity; the only mode this omits is ``Peacebringer_Blaster_Mode``.
"""

from __future__ import annotations

import re

from ._reader import BinReader

_IDENT_RE = re.compile(r"^[A-Za-z][A-Za-z0-9_]*$")

# Minimum plausible length for the mode run — guards against a stray short run
# of same-shaped records being mistaken for the mode table.
_MIN_RUN = 32

# Per-mode record stride in bytes: flag(u4) type(u4) name(str) display(str).
_REC = 16


def parse_mode_table(data: bytes) -> dict[int, str]:
    """Return ``{mode_index: mode_name}`` (1-based) from ``attrib_names.bin``.

    Returns an empty dict if the mode array cannot be located (e.g. an
    unexpected layout on a server variant), so callers degrade to emitting no
    mode names rather than crashing.
    """
    try:
        br = BinReader(data)
    except Exception:
        return {}

    buf = br._data
    strtab_base = br._strtab_base
    strtab = br._strtab_data
    n = len(buf)

    def u4(pos: int) -> int:
        return int.from_bytes(buf[pos:pos + 4], "little")

    def resolve(off: int) -> str | None:
        if off == 0:
            return ""
        p = strtab_base + off
        if p < 0 or p >= len(strtab):
            return None
        e = p
        while e < len(strtab) and strtab[e] != 0:
            e += 1
        try:
            return bytes(strtab[p:e]).decode("ascii")
        except UnicodeDecodeError:
            return None

    def record_name(pos: int) -> str | None:
        """If a valid mode record starts at ``pos``, return its name, else None."""
        if pos + _REC > n:
            return None
        if u4(pos + 4) != 12:  # the mode-record `type` constant
            return None
        name = resolve(u4(pos + 8))
        if not name or not _IDENT_RE.match(name):
            return None
        disp = resolve(u4(pos + 12))  # display: may be empty or contain spaces
        if disp is None:
            return None
        return name

    # Scan the whole data region for the longest contiguous 16-byte-record run.
    best_start = best_len = 0
    pos = br.pos
    while pos + _REC <= n:
        if record_name(pos) is not None:
            run_start = pos
            run_len = 0
            while record_name(pos) is not None:
                pos += _REC
                run_len += 1
            if run_len > best_len:
                best_start, best_len = run_start, run_len
        else:
            pos += 4

    if best_len < _MIN_RUN:
        return {}

    # The ``Set_Mode`` magnitude is a direct index into this run: the run's
    # first record is index 0 (``ServerTrayOverride``, a system slot no player
    # power sets), so ``Peacebringer_Blaster_Mode`` is 1, ``Domination`` is 45,
    # ``Domination_Active`` 46, ``RestedAdaptation`` 153, and so on.
    table: dict[int, str] = {}
    for i in range(best_len):
        name = resolve(u4(best_start + i * _REC + 8))
        if name:
            table[i] = name
    return table
