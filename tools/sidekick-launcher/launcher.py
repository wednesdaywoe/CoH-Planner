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


def launch_tool(tool: dict) -> tuple[bool, str]:
    """Spawn a tool. Prefers an explicit argv `command` (so we can pass
    --no-browser and avoid double-opening tabs); falls back to the .bat
    launcher if `command` is absent."""
    flags = 0
    if sys.platform == "win32":
        flags = subprocess.CREATE_NEW_CONSOLE | subprocess.CREATE_NEW_PROCESS_GROUP

    command = tool.get("command")
    if command:
        cwd_rel = tool.get("cwd", ".")
        cwd = (ROOT / cwd_rel).resolve()
        if not cwd.exists():
            return False, f"cwd not found: {cwd}"
        try:
            subprocess.Popen(
                command,
                cwd=str(cwd),
                creationflags=flags,
                stdin=subprocess.DEVNULL,
            )
            return True, "launched"
        except OSError as e:
            return False, str(e)

    launcher_rel = tool.get("launcher")
    if not launcher_rel:
        return False, "no launcher or command configured"
    launcher = (ROOT / launcher_rel).resolve()
    if not launcher.exists():
        return False, f"launcher not found: {launcher}"
    try:
        subprocess.Popen(
            [str(launcher)],
            cwd=str(launcher.parent),
            shell=True,
            creationflags=flags,
            stdin=subprocess.DEVNULL,
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
    url = f"http://localhost:{args.port}/"
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
