from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
import json
import os
from pathlib import Path
import sqlite3
from urllib.parse import unquote, urlparse


ROOT = Path(__file__).resolve().parent
DATA_DIR = ROOT / "data"
DB_PATH = DATA_DIR / "texts.sqlite"
PORT = int(os.environ.get("PORT", "8767"))


def get_connection():
    DATA_DIR.mkdir(exist_ok=True)
    connection = sqlite3.connect(DB_PATH)
    connection.execute(
        """
        CREATE TABLE IF NOT EXISTS books (
            book_id TEXT PRIMARY KEY,
            pages TEXT NOT NULL,
            updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
        """
    )
    return connection


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def end_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(204)
        self.end_headers()

    def do_GET(self):
        if urlparse(self.path).path == "/api/health":
            self.send_json({"ok": True})
            return

        book_id = self.get_book_id()
        if book_id is None:
            return super().do_GET()

        with get_connection() as connection:
            row = connection.execute(
                "SELECT pages FROM books WHERE book_id = ?",
                (book_id,),
            ).fetchone()

        pages = json.loads(row[0]) if row else [[]]
        self.send_json({"bookId": book_id, "pages": pages})

    def do_POST(self):
        book_id = self.get_book_id()
        if book_id is None:
            self.send_error(404)
            return

        length = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(length).decode("utf-8")
        try:
            payload = json.loads(body) if body else {}
            pages = payload.get("pages", [[]])
            if not isinstance(pages, list):
                raise ValueError("pages must be a list")
        except (json.JSONDecodeError, ValueError) as error:
            self.send_error(400, str(error))
            return

        with get_connection() as connection:
            connection.execute(
                """
                INSERT INTO books (book_id, pages, updated_at)
                VALUES (?, ?, CURRENT_TIMESTAMP)
                ON CONFLICT(book_id) DO UPDATE SET
                    pages = excluded.pages,
                    updated_at = CURRENT_TIMESTAMP
                """,
                (book_id, json.dumps(pages)),
            )

        self.send_json({"ok": True, "bookId": book_id})

    def get_book_id(self):
        path = urlparse(self.path).path
        prefix = "/api/books/"
        if not path.startswith(prefix):
            return None
        book_id = unquote(path[len(prefix):]).strip()
        return book_id or None

    def send_json(self, payload):
        data = json.dumps(payload).encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)


if __name__ == "__main__":
    server = ThreadingHTTPServer(("0.0.0.0", PORT), Handler)
    print(f"Serving {ROOT} with database at http://0.0.0.0:{PORT}")
    server.serve_forever()
