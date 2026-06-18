#!/usr/bin/env bash
# Sidekick Launcher — POSIX (Linux/macOS) counterpart to SidekickLauncher.bat.
# Double-click or run `./SidekickLauncher.sh` to start the dashboard at
# http://localhost:8000/.
set -e
cd "$(dirname "$0")/tools/sidekick-launcher"
# Prefer python3, fall back to python (which is Python 3 on modern systems).
if command -v python3 >/dev/null 2>&1; then
  exec python3 launcher.py "$@"
else
  exec python launcher.py "$@"
fi
