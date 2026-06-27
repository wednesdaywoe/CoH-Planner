"""
Sidekick Launcher — single front door for the Sidekick suite of tools.

Serves a small dashboard at http://localhost:8000/ that shows the live status of
each registered tool (Pigg Wrangler, Bin Crawler, ...) and lets you open or
launch them. Tool registry lives in tools.json next to this file.
"""

from __future__ import annotations

import argparse
import json
import mimetypes
import socket
import subprocess
import sys
import webbrowser
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parent
STATIC = ROOT / "static"
CONFIG_PATH = ROOT / "tools.json"


def load_config() -> dict:
    return json.loads(CONFIG_PATH.read_text(encoding="utf-8"))


def port_open(port: int, host: str = "127.0.0.1", timeout: float = 0.25) -> bool:
    """Return True if something is accepting connections on host:port."""
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
        sock.settimeout(timeout)
        try:
            sock.connect((host, port))
            return True
        except (OSError, socket.timeout):
            return False


_PYTHON_HEADS = {"py", "py.exe", "python", "python.exe", "python3", "python3.exe"}


def resolve_command(command: list[str]) -> list[str]:
    """Make a tools.json `command` cross-platform.

    The registry uses the Windows form ``["py", "-3", "-m", "pkg", ...]``, but
    ``py`` (the Windows Python launcher) doesn't exist on Linux/macOS. Replace a
    leading Python launcher — ``py`` / ``python`` / ``python3``, plus an optional
    ``py``-style ``-3`` version selector — with the interpreter running THIS
    launcher (``sys.executable``), so child tools use the same Python on every
    platform. Non-Python commands pass through untouched.
    """
    if not command:
        return command
    head = Path(command[0]).name.lower()
    if head not in _PYTHON_HEADS and not head.startswith("python3."):
        return command
    rest = command[1:]
    # Drop a Windows `py`-launcher version selector ("-3", "-3.11") — it's
    # meaningless to a direct interpreter and would be read as a script flag.
    if rest and rest[0].startswith("-3"):
        rest = rest[1:]
    return [sys.executable, *rest]


def _spawn_kwargs() -> dict:
    """Detach the child so it keeps running independently of the launcher: a
    fresh console + process group on Windows, a new session on POSIX."""
    if sys.platform == "win32":
        return {"creationflags": subprocess.CREATE_NEW_CONSOLE | subprocess.CREATE_NEW_PROCESS_GROUP}
    return {"start_new_session": True}


def launch_tool(tool: dict) -> tuple[bool, str]:
    """Spawn a tool. Prefers an explicit argv `command` (so we can pass
    --no-browser and avoid double-opening tabs); falls back to the platform
    launcher script if `command` is absent."""
    command = tool.get("command")
    if command:
        cwd_rel = tool.get("cwd", ".")
        cwd = (ROOT / cwd_rel).resolve()
        if not cwd.exists():
            return False, f"cwd not found: {cwd}"
        try:
            subprocess.Popen(
                resolve_command(command),
                cwd=str(cwd),
                stdin=subprocess.DEVNULL,
                **_spawn_kwargs(),
            )
            return True, "launched"
        except OSError as e:
            return False, str(e)

    # Fallback: a `launcher` script. On Windows that's the `.bat`; on POSIX try a
    # sibling `.sh` with the same stem so a command-less tool still launches.
    launcher_rel = tool.get("launcher")
    if not launcher_rel:
        return False, "no launcher or command configured"
    launcher = (ROOT / launcher_rel).resolve()
    if sys.platform != "win32" and launcher.suffix.lower() == ".bat":
        sh = launcher.with_suffix(".sh")
        if sh.exists():
            launcher = sh
    if not launcher.exists():
        return False, f"launcher not found: {launcher}"
    try:
        argv = [str(launcher)] if sys.platform == "win32" else ["/bin/sh", str(launcher)]
        subprocess.Popen(
            argv,
            cwd=str(launcher.parent),
            shell=(sys.platform == "win32"),
            stdin=subprocess.DEVNULL,
            **_spawn_kwargs(),
        )
        return True, "launched"
    except OSError as e:
        return False, str(e)


class Handler(BaseHTTPRequestHandler):
    def log_message(self, fmt, *args):
        # Quiet by default; uncomment for debugging.
        pass

    def _send_json(self, status: int, payload: dict) -> None:
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _send_file(self, path: Path, content_type: str) -> None:
        try:
            data = path.read_bytes()
        except FileNotFoundError:
            self.send_error(404)
            return
        self.send_response(200)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def do_GET(self):
        path = urlparse(self.path).path
        if path == "/" or path == "/index.html":
            self._send_file(STATIC / "index.html", "text/html; charset=utf-8")
            return
        if path == "/api/status":
            config = load_config()
            statuses = [
                {**t, "running": port_open(t["port"])} for t in config["tools"]
            ]
            self._send_json(200, {
                "tools": statuses,
                "links": config.get("links", []),
                "brand_icon": "/icons/_brand" if config.get("brand_icon") else None,
            })
            return
        if path.startswith("/icons/"):
            self._serve_icon(path[len("/icons/"):])
            return
        self.send_error(404)

    def _serve_icon(self, ident: str) -> None:
        config = load_config()
        icon_rel = None
        if ident == "_brand":
            icon_rel = config.get("brand_icon")
        else:
            for collection in ("tools", "links"):
                for entry in config.get(collection, []):
                    if entry.get("id") == ident:
                        icon_rel = entry.get("icon")
                        break
                if icon_rel:
                    break
        if not icon_rel:
            self.send_error(404)
            return
        icon_path = (ROOT / icon_rel).resolve()
        if not icon_path.is_file():
            self.send_error(404)
            return
        ctype = mimetypes.guess_type(icon_path.name)[0] or "application/octet-stream"
        self._send_file(icon_path, ctype)

    def do_POST(self):
        path = urlparse(self.path).path
        if path == "/api/launch":
            length = int(self.headers.get("Content-Length", "0"))
            try:
                payload = json.loads(self.rfile.read(length) or b"{}")
            except json.JSONDecodeError:
                self._send_json(400, {"ok": False, "error": "invalid json"})
                return
            tool_id = payload.get("id")
            config = load_config()
            tool = next((t for t in config["tools"] if t["id"] == tool_id), None)
            if not tool:
                self._send_json(404, {"ok": False, "error": "unknown tool id"})
                return
            ok, msg = launch_tool(tool)
            self._send_json(200 if ok else 500, {"ok": ok, "message": msg})
            return
        self.send_error(404)


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--port", "-p", type=int, default=8000)
    ap.add_argument("--no-browser", action="store_true", help="don't auto-open the dashboard")
    args = ap.parse_args()

    server = ThreadingHTTPServer(("127.0.0.1", args.port), Handler)
    # Use 127.0.0.1, not localhost: browsers that have cached an HTTP/2 (Alt-Svc
    # / h2c prior-knowledge) association for the `localhost` hostname send an
    # HTTP/2 request to this cleartext HTTP/1 server, which answers 505 HTTP
    # Version Not Supported. IP literals never get that treatment.
    url = f"http://127.0.0.1:{args.port}/"
    print(f"Sidekick Launcher running at {url}")
    if not args.no_browser:
        webbrowser.open(url)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down.")
        server.server_close()


if __name__ == "__main__":
    main()
