"""Client message resolution for CoH display strings.

Power records store display names as CRC32 hashes in the format P{number}.
These resolve to English text using clientmessages-en.bin, which contains
all localized strings as null-terminated entries.

Usage:
    msgs = load_messages(Path("G:/Homecoming/assets/live/bin/clientmessages-en.bin"))
    display = msgs.resolve("P3321619256")  # -> "Flight"
"""

import zlib
from pathlib import Path


class MessageTable:
    """CRC32 -> string lookup table for resolving P-hash display names."""

    __slots__ = ("_table",)

    def __init__(self, table: dict[int, str]):
        self._table = table

    def resolve(self, value: str) -> str:
        """Resolve a P-hash string like 'P3321619256' to its display text.

        Returns the original string unchanged if it's not a P-hash or
        if the hash is not found in the table.
        """
        if not value.startswith("P") or not value[1:].isdigit():
            return value
        crc = int(value[1:])
        return self._table.get(crc, value)

    def __len__(self):
        return len(self._table)


def load_messages(bin_path_or_data) -> MessageTable:
    """Load clientmessages-en.bin and build a CRC32 lookup table.

    File format:
      u4 date (e.g. 20090521)
      u4 entry_count
      null-terminated UTF-8 strings (sequential)

    Accepts either a file path or raw bytes.
    """
    if isinstance(bin_path_or_data, (bytes, memoryview)):
        data = bin_path_or_data
    else:
        data = bin_path_or_data.read_bytes()

    # Skip 8-byte header
    pos = 8
    table: dict[int, str] = {}

    while pos < len(data):
        end = pos
        while end < len(data) and data[end] != 0:
            end += 1
        if end > pos:
            try:
                s = data[pos:end].decode("utf-8")
                crc = zlib.crc32(s.encode("utf-8")) & 0xFFFFFFFF
                # Keep first occurrence (avoid collisions overwriting)
                if crc not in table:
                    table[crc] = s
            except (UnicodeDecodeError, ValueError):
                pass
        pos = end + 1

    return MessageTable(table)
