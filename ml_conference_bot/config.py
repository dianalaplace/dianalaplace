import os
from dotenv import load_dotenv

load_dotenv()

TELEGRAM_TOKEN: str = os.environ["TELEGRAM_BOT_TOKEN"]
ANTHROPIC_API_KEY: str = os.environ["ANTHROPIC_API_KEY"]

REPORT_HOUR: int = int(os.getenv("REPORT_HOUR", "9"))
REPORT_MINUTE: int = int(os.getenv("REPORT_MINUTE", "0"))
DB_PATH: str = os.getenv("DB_PATH", "data/events.db")

MODEL = "claude-sonnet-4-6"
MAX_TOOL_CALLS = 40        # safety limit per agent run
FETCH_TIMEOUT = 20         # seconds per HTTP request
MAX_PAGE_CHARS = 7000      # chars fed to Claude per page
