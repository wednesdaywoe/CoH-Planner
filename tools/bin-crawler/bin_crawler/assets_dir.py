"""Shared, remembered selection of the directory each Bin Crawler command reads.

Every command needs a directory of game data — the assets folder holding the
`.pigg` archives (or, for the diff tool, a root holding two such folders). Rather
than retype ``--assets-dir`` every run, :func:`resolve_dir` applies this
precedence:

  1. An explicit path on the command line (deterministic for scripts/CI; also
     remembered for next time).
  2. ``--pick`` forces the folder dialog even when a path is remembered.
  3. A path saved from a previous run (namespaced per ``key``), if it still
     exists and looks valid.
  4. A native folder-picker dialog (tkinter). On a headless box with no GUI it
     falls back to a typed prompt.

The chosen path is saved to a small JSON config (``~/.config/bin-crawler/
config.json``, or ``%APPDATA%\\bin-crawler\\config.json`` on Windows) so later
runs need no flag at all.
"""

from __future__ import annotations

import json
import os
import sys
from pathlib import Path
from typing import Callable

from .parser._pigg import BinResolver

_APP = "bin-crawler"


def _config_path() -> Path:
    if sys.platform.startswith("win"):
        base = Path(os.environ.get("APPDATA") or Path.home() / "AppData" / "Roaming")
    else:
        base = Path(os.environ.get("XDG_CONFIG_HOME") or Path.home() / ".config")
    return base / _APP / "config.json"


def _load_config() -> dict:
    try:
        data = json.loads(_config_path().read_text())
        return data if isinstance(data, dict) else {}
    except (OSError, ValueError):
        return {}


def _save_config(key: str, value: str) -> None:
    path = _config_path()
    cfg = _load_config()
    cfg[key] = value
    try:
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(json.dumps(cfg, indent=2))
    except OSError:
        pass  # non-fatal — we just re-prompt next time


def is_assets_dir(path: str | os.PathLike) -> bool:
    """True if `path` is a directory holding .pigg archives or loose .bin files."""
    try:
        return Path(path).is_dir() and BinResolver(path).has_data
    except Exception:
        return False


def _pick_dialog(title: str, initialdir: str | None) -> str | None:
    """Native folder picker; returns None when cancelled or no GUI is available."""
    try:
        import tkinter as tk
        from tkinter import filedialog
    except Exception:
        return None
    try:
        root = tk.Tk()
        root.withdraw()
        root.update()  # realize the hidden root before opening the dialog
        chosen = filedialog.askdirectory(
            title=title,
            initialdir=initialdir or str(Path.home()),
            mustexist=True,
        )
        root.destroy()
        return chosen or None
    except Exception:
        return None  # e.g. TclError when there is no display


def _prompt_typed(title: str, initial: str | None) -> str | None:
    suffix = f" [{initial}]" if initial else ""
    try:
        raw = input(f"{title}\nPath{suffix}: ").strip()
    except EOFError:
        return None
    return raw or initial


def resolve_dir(
    cli_value: str | None,
    *,
    key: str,
    title: str,
    pick: bool = False,
    validate: Callable[[str | os.PathLike], bool] = is_assets_dir,
    remember: bool = True,
) -> str:
    """Resolve a directory for a command (precedence in the module docstring).

    `key` namespaces the remembered path (e.g. ``"assets_dir"`` vs
    ``"assets_root"``). `validate` gates what counts as a usable directory to
    remember and warns on a bad pick; pass a laxer predicate (e.g.
    ``lambda p: Path(p).is_dir()``) for non-assets directories.
    """
    saved = _load_config().get(key)

    # 1. Explicit flag wins — unless --pick was also given to force a re-choose.
    if cli_value and not pick:
        if remember and validate(cli_value):
            _save_config(key, cli_value)
        return cli_value

    # 2. Remembered path, when not forcing the picker.
    if not pick and saved and validate(saved):
        return saved

    # 3. Folder picker, then typed-prompt fallback (headless / no tkinter).
    initial = cli_value or saved
    chosen = _pick_dialog(title, initial) or _prompt_typed(title, initial)
    if not chosen:
        fallback = cli_value or saved
        if fallback:
            print(f"No directory selected; using {fallback}", file=sys.stderr)
            return fallback
        sys.exit("No directory selected and none remembered — aborting.")

    if remember and validate(chosen):
        _save_config(key, chosen)
    elif not validate(chosen):
        print(f"Warning: {chosen} has no .pigg/.bin data — using it anyway.", file=sys.stderr)
    return chosen


def resolve_assets_dir(cli_value: str | None, *, pick: bool = False) -> str:
    """Resolve the assets directory (the folder containing the .pigg/.bin files)."""
    return resolve_dir(
        cli_value,
        key="assets_dir",
        title="Select the game assets directory (the folder containing the .pigg files)",
        pick=pick,
    )
