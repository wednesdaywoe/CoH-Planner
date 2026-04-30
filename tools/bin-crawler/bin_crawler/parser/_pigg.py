"""Resolve .bin files from pigg archives or loose directories.

The pigg archive format itself is handled by the Pigg Wrangler library;
this module only provides the bin-file resolution layer that Bin Crawler
needs to find `powers.bin`, `powersets.bin`, etc., given an assets
directory that may contain any mix of pigg archives and loose files.
"""

from __future__ import annotations

import hashlib
import tempfile
from pathlib import Path

from pigg_wrangler.pigg import PiggArchive


class BinResolver:
    """Resolve .bin files from pigg archives or a loose directory.

    Usage:
        resolver = BinResolver("G:/Homecoming/assets/live")
        powers_data = resolver.read("powers.bin")

    Search order:
      1. Pigg archives (bin.pigg, bin_powers.pigg, ...) in the directory
      2. Loose .bin files in a bin/ subdirectory
      3. Loose .bin files directly in the directory
    """

    def __init__(self, assets_dir: str | Path):
        self.assets_dir = Path(assets_dir)
        self._piggs: list[PiggArchive] = []
        self._bin_dir: Path | None = None

        seen: set[Path] = set()
        for pattern in ("bin*.pigg", "*_bin.pigg", "*_bin_*.pigg"):
            for pigg_path in sorted(self.assets_dir.glob(pattern)):
                if pigg_path in seen:
                    continue
                seen.add(pigg_path)
                try:
                    self._piggs.append(PiggArchive(pigg_path))
                except (ValueError, OSError):
                    pass

        bin_subdir = self.assets_dir / "bin"
        if bin_subdir.is_dir():
            self._bin_dir = bin_subdir
        elif any(self.assets_dir.glob("*.bin")):
            self._bin_dir = self.assets_dir

    @property
    def source_description(self) -> str:
        if self._piggs:
            pigg_names = [Path(p.pigg_path).name for p in self._piggs]
            return f"{self.assets_dir} (piggs: {', '.join(pigg_names)})"
        if self._bin_dir:
            return f"{self._bin_dir} (loose files)"
        return f"{self.assets_dir} (no data found)"

    def has(self, filename: str) -> bool:
        for pigg in self._piggs:
            if pigg.has(filename):
                return True
        if self._bin_dir and (self._bin_dir / filename).is_file():
            return True
        return False

    def read(self, filename: str) -> bytes:
        """Read a .bin file, preferring pigg archives over loose files."""
        for pigg in self._piggs:
            if pigg.has(filename):
                return pigg.extract(filename)

        if self._bin_dir:
            loose = self._bin_dir / filename
            if loose.is_file():
                return loose.read_bytes()

        raise FileNotFoundError(
            f"{filename!r} not found in piggs or "
            f"{self._bin_dir or self.assets_dir}"
        )

    def read_to_tempfile(self, filename: str) -> Path:
        """Extract a bin file to a temp path, for parsers that expect file paths.

        Files are cached in the system temp dir keyed by content hash, so
        repeated reads within a session reuse the same file.
        """
        data = self.read(filename)
        digest = hashlib.md5(data[:4096]).hexdigest()[:12]
        tmp_dir = Path(tempfile.gettempdir()) / "coh_bin_crawler"
        tmp_dir.mkdir(exist_ok=True)
        tmp_path = tmp_dir / f"{filename}.{digest}"
        if not tmp_path.exists():
            tmp_path.write_bytes(data)
        return tmp_path
