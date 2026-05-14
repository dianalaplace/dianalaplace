"""Claude tool-use agent that searches curated sources and returns structured events."""
import asyncio
import json
import logging
import re
from datetime import date

import anthropic
import httpx
from bs4 import BeautifulSoup

import config
from sources import SOURCES

logger = logging.getLogger(__name__)

_client = anthropic.Anthropic(api_key=config.ANTHROPIC_API_KEY)

# ── Tool definition ───────────────────────────────────────────────────────────

TOOLS = [
    {
        "name": "fetch_url",
        "description": (
            "Fetch a web page and return its cleaned text content. "
            "Use this to read conference pages, summer school listings, and hackathon sites."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "url": {"type": "string", "description": "URL to fetch"},
            },
            "required": ["url"],
        },
    }
]

# ── System prompt ─────────────────────────────────────────────────────────────

SYSTEM_PROMPT = """\
You are an ML-events finder agent helping a student specializing in \
Machine Learning for Life Sciences (genomics, drug discovery, bioinformatics, computational biology).

Your goal: fetch the provided sources and extract ALL upcoming events where the application \
deadline OR the event date is still in the future (today = {today}).

Events of interest (in order of priority):
1. HIGH – Conferences, workshops, summer schools, or hackathons with explicit focus on \
   ML in healthcare / genomics / bioinformatics / drug discovery / computational biology
2. MEDIUM – Major ML/AI conferences (NeurIPS, ICML, ICLR, AAAI) that have relevant workshops
3. LOW – General ML hackathons or schools open to bio-oriented students

For EACH event extract:
  name                  – full event name
  type                  – one of: conference | summer_school | hackathon | workshop | fellowship
  url                   – direct link to the event page (not the index page you fetched)
  event_start           – event start date (YYYY-MM-DD or descriptive if exact date unknown)
  event_end             – event end date (or null)
  application_deadline  – deadline for applications / abstract submission / registration (YYYY-MM-DD or descriptive; null if not found)
  location              – city, state, USA  |  Virtual  |  Hybrid  |  Unknown
  description           – 2-3 sentence description focused on the scientific program
  requirements          – who can apply (degree level, affiliation, etc.)
  price                 – registration fee or "Free" or "TBD"
  international_eligible – true | false | unknown
  scholarships          – description of financial aid / travel grants / fee waivers, or null
  bio_ml_focus          – specific bio/health sub-areas covered, or null
  priority              – high | medium | low

Return ONLY a JSON array of event objects. No prose, no markdown fences, just raw JSON.
If a page has no upcoming events, return an empty array for that source.
Merge all sources into one final JSON array before returning.\
"""

# ── HTTP fetcher (sync, called in threadpool) ─────────────────────────────────

def _fetch_sync(url: str) -> str:
    headers = {"User-Agent": "Mozilla/5.0 (compatible; MLEventBot/1.0)"}
    try:
        with httpx.Client(timeout=config.FETCH_TIMEOUT, follow_redirects=True) as client:
            r = client.get(url, headers=headers)
            r.raise_for_status()
            soup = BeautifulSoup(r.text, "lxml")
            for tag in soup(["script", "style", "nav", "footer", "header", "aside"]):
                tag.decompose()
            text = soup.get_text(separator="\n", strip=True)
            # Collapse blank lines
            text = re.sub(r"\n{3,}", "\n\n", text)
            return text[: config.MAX_PAGE_CHARS]
    except Exception as exc:
        logger.warning("fetch_url failed for %s: %s", url, exc)
        return f"[Error fetching {url}: {exc}]"


async def _fetch(url: str) -> str:
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(None, _fetch_sync, url)


# ── Tool executor ─────────────────────────────────────────────────────────────

async def _execute_tool(name: str, tool_input: dict) -> str:
    if name == "fetch_url":
        return await _fetch(tool_input["url"])
    return f"Unknown tool: {name}"


# ── JSON extraction helper ────────────────────────────────────────────────────

def _extract_json(text: str) -> list[dict]:
    # Try direct parse first
    try:
        result = json.loads(text.strip())
        if isinstance(result, list):
            return result
    except json.JSONDecodeError:
        pass
    # Try to find a JSON array in the text
    match = re.search(r"\[.*\]", text, re.DOTALL)
    if match:
        try:
            return json.loads(match.group())
        except json.JSONDecodeError:
            pass
    logger.warning("Could not parse JSON from agent response")
    return []


# ── Main agent entrypoint ─────────────────────────────────────────────────────

async def find_events() -> list[dict]:
    """Run the agent and return a list of raw event dicts."""
    today = date.today().isoformat()
    source_list = "\n".join(
        f"- {s['url']}  ({s['hint']})" for s in SOURCES
    )
    user_message = (
        f"Today is {today}. Please fetch each of the following sources and extract "
        f"all upcoming ML/bio events with deadlines or dates still in the future:\n\n"
        f"{source_list}\n\n"
        "Fetch every URL, then return a single merged JSON array of all events found."
    )

    messages: list[dict] = [{"role": "user", "content": user_message}]
    tool_calls_used = 0

    while tool_calls_used < config.MAX_TOOL_CALLS:
        response = await asyncio.get_event_loop().run_in_executor(
            None,
            lambda: _client.messages.create(
                model=config.MODEL,
                max_tokens=8192,
                system=SYSTEM_PROMPT.format(today=today),
                tools=TOOLS,
                messages=messages,
            ),
        )

        if response.stop_reason == "tool_use":
            tool_results = []
            for block in response.content:
                if block.type == "tool_use":
                    tool_calls_used += 1
                    logger.info("Agent calling %s(%s)", block.name, list(block.input.keys()))
                    result = await _execute_tool(block.name, block.input)
                    tool_results.append(
                        {
                            "type": "tool_result",
                            "tool_use_id": block.id,
                            "content": result,
                        }
                    )
            messages.append({"role": "assistant", "content": response.content})
            messages.append({"role": "user", "content": tool_results})

        elif response.stop_reason == "end_turn":
            for block in response.content:
                if hasattr(block, "text") and block.text:
                    events = _extract_json(block.text)
                    logger.info("Agent returned %d events", len(events))
                    return events
            break

        else:
            logger.warning("Unexpected stop_reason: %s", response.stop_reason)
            break

    logger.warning("Agent loop ended after %d tool calls without final answer", tool_calls_used)
    return []
