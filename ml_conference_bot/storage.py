"""Async SQLite storage for subscribers and events."""
import hashlib
import json
import os
import aiosqlite
from config import DB_PATH


async def init() -> None:
    os.makedirs(os.path.dirname(DB_PATH) or ".", exist_ok=True)
    async with aiosqlite.connect(DB_PATH) as db:
        await db.executescript("""
            CREATE TABLE IF NOT EXISTS subscribers (
                chat_id INTEGER PRIMARY KEY,
                subscribed_at TEXT DEFAULT (datetime('now'))
            );

            CREATE TABLE IF NOT EXISTS seen_events (
                event_hash TEXT PRIMARY KEY,
                name TEXT,
                first_seen TEXT DEFAULT (datetime('now'))
            );

            CREATE TABLE IF NOT EXISTS events (
                event_hash TEXT PRIMARY KEY,
                data TEXT NOT NULL,
                found_at TEXT DEFAULT (datetime('now'))
            );
        """)
        await db.commit()


# ── Subscribers ───────────────────────────────────────────────────────────────

async def add_subscriber(chat_id: int) -> bool:
    """Returns True if newly added, False if already existed."""
    async with aiosqlite.connect(DB_PATH) as db:
        cursor = await db.execute(
            "INSERT OR IGNORE INTO subscribers (chat_id) VALUES (?)", (chat_id,)
        )
        await db.commit()
        return cursor.rowcount > 0


async def remove_subscriber(chat_id: int) -> None:
    async with aiosqlite.connect(DB_PATH) as db:
        await db.execute("DELETE FROM subscribers WHERE chat_id = ?", (chat_id,))
        await db.commit()


async def get_subscribers() -> list[int]:
    async with aiosqlite.connect(DB_PATH) as db:
        cursor = await db.execute("SELECT chat_id FROM subscribers")
        rows = await cursor.fetchall()
        return [r[0] for r in rows]


# ── Events ────────────────────────────────────────────────────────────────────

def event_hash(event: dict) -> str:
    key = (event.get("url") or event.get("name", "")).strip().lower()
    return hashlib.sha256(key.encode()).hexdigest()[:16]


async def save_events(events: list[dict]) -> list[dict]:
    """Persist events; return only events not previously seen."""
    new_events: list[dict] = []
    async with aiosqlite.connect(DB_PATH) as db:
        for ev in events:
            h = event_hash(ev)
            cursor = await db.execute(
                "INSERT OR IGNORE INTO seen_events (event_hash, name) VALUES (?, ?)",
                (h, ev.get("name", "")),
            )
            if cursor.rowcount > 0:
                new_events.append(ev)
                await db.execute(
                    "INSERT OR REPLACE INTO events (event_hash, data) VALUES (?, ?)",
                    (h, json.dumps(ev, ensure_ascii=False)),
                )
        await db.commit()
    return new_events


async def get_recent_events(limit: int = 30) -> list[dict]:
    """Return the most recently found events for on-demand reports."""
    async with aiosqlite.connect(DB_PATH) as db:
        cursor = await db.execute(
            "SELECT data FROM events ORDER BY found_at DESC LIMIT ?", (limit,)
        )
        rows = await cursor.fetchall()
        return [json.loads(r[0]) for r in rows]
