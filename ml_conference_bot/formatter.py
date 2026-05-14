"""Format event dicts into Telegram HTML messages."""
from typing import Optional

PRIORITY_EMOJI = {"high": "🔬", "medium": "🤖", "low": "📌"}
TYPE_LABEL = {
    "conference": "Conference",
    "summer_school": "Summer School",
    "hackathon": "Hackathon",
    "workshop": "Workshop",
    "fellowship": "Fellowship / Program",
}


def _esc(text: str) -> str:
    """Escape HTML special chars."""
    return (
        str(text)
        .replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
    )


def _yn(value: Optional[bool]) -> str:
    if value is True:
        return "✅ Yes"
    if value is False:
        return "❌ No"
    return "❓ Unknown"


def format_event(ev: dict) -> str:
    priority = ev.get("priority", "medium")
    emoji = PRIORITY_EMOJI.get(priority, "📌")
    ev_type = TYPE_LABEL.get(ev.get("type", ""), ev.get("type", "Event"))
    name = _esc(ev.get("name", "Unnamed event"))
    url = ev.get("url", "")

    lines: list[str] = []

    # Header
    lines.append(f"{emoji} <b><a href=\"{url}\">{name}</a></b>")
    lines.append(f"<i>{_esc(ev_type)}</i>")

    if ev.get("description"):
        lines.append(f"\n{_esc(ev['description'])}")

    lines.append("")

    # Dates
    if ev.get("event_start"):
        dates = _esc(ev["event_start"])
        if ev.get("event_end"):
            dates += f" → {_esc(ev['event_end'])}"
        lines.append(f"📅 <b>Dates:</b> {dates}")

    if ev.get("application_deadline"):
        lines.append(f"⏰ <b>Deadline:</b> {_esc(ev['application_deadline'])}")

    if ev.get("location"):
        lines.append(f"📍 <b>Location:</b> {_esc(ev['location'])}")

    # Requirements & cost
    if ev.get("requirements"):
        lines.append(f"👤 <b>Requirements:</b> {_esc(ev['requirements'])}")

    if ev.get("price"):
        lines.append(f"💰 <b>Price:</b> {_esc(ev['price'])}")

    # International & scholarships
    lines.append(f"🌍 <b>International students:</b> {_yn(ev.get('international_eligible'))}")

    if ev.get("scholarships"):
        lines.append(f"🎓 <b>Scholarships:</b> {_esc(ev['scholarships'])}")

    # Bio/ML focus
    if ev.get("bio_ml_focus"):
        lines.append(f"🧬 <b>Bio/ML focus:</b> {_esc(ev['bio_ml_focus'])}")

    return "\n".join(lines)


def format_report(events: list[dict], is_new: bool = True) -> list[str]:
    """
    Split a list of events into Telegram-safe message chunks (≤4096 chars each).
    Returns a list of HTML strings.
    """
    if not events:
        return [
            "🔍 <b>No new events found today.</b>\n\n"
            "I'll keep checking daily. Use /report to pull the latest stored events."
        ]

    # Sort: high priority first
    priority_order = {"high": 0, "medium": 1, "low": 2}
    events = sorted(events, key=lambda e: priority_order.get(e.get("priority", "low"), 2))

    header = (
        "🔬 <b>ML Events Report</b> – new opportunities\n"
        if is_new
        else "📋 <b>ML Events Report</b> – recent events\n"
    )
    header += f"Found <b>{len(events)}</b> event(s)\n"
    header += "─" * 30

    chunks: list[str] = []
    current = header

    for ev in events:
        block = "\n\n" + format_event(ev) + "\n" + "─" * 30
        if len(current) + len(block) > 4000:
            chunks.append(current)
            current = block.lstrip("\n")
        else:
            current += block

    if current:
        chunks.append(current)

    return chunks


def format_welcome() -> str:
    return (
        "👋 <b>Hello! I'm your ML Events Bot.</b>\n\n"
        "I search the web daily for conferences, summer schools, hackathons and fellowships "
        "relevant to <b>Machine Learning in Life Sciences</b> — genomics, drug discovery, "
        "bioinformatics, computational biology.\n\n"
        "<b>Commands:</b>\n"
        "/start   – subscribe to daily reports\n"
        "/stop    – unsubscribe\n"
        "/report  – get the latest events right now\n"
        "/help    – show this message\n\n"
        f"Reports are sent daily at <b>{__import__('config').REPORT_HOUR:02d}:{__import__('config').REPORT_MINUTE:02d} UTC</b>."
    )
