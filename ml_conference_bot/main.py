"""Entry point – starts the Telegram bot with daily scheduled reports."""
import asyncio
import logging
from datetime import time

from telegram.ext import Application, CommandHandler

import config
import storage
from bot import cmd_start, cmd_stop, cmd_report, cmd_help, daily_report_job

logging.basicConfig(
    format="%(asctime)s  %(levelname)-8s  %(name)s – %(message)s",
    level=logging.INFO,
)
logging.getLogger("httpx").setLevel(logging.WARNING)
logging.getLogger("httpcore").setLevel(logging.WARNING)
logger = logging.getLogger(__name__)


async def post_init(application: Application) -> None:
    await storage.init()
    logger.info("Storage initialized")

    # Schedule daily report
    report_time = time(hour=config.REPORT_HOUR, minute=config.REPORT_MINUTE)
    application.job_queue.run_daily(
        daily_report_job,
        time=report_time,
        name="daily_ml_report",
    )
    logger.info(
        "Daily report scheduled at %02d:%02d UTC",
        config.REPORT_HOUR,
        config.REPORT_MINUTE,
    )


def main() -> None:
    app = (
        Application.builder()
        .token(config.TELEGRAM_TOKEN)
        .post_init(post_init)
        .build()
    )

    app.add_handler(CommandHandler("start", cmd_start))
    app.add_handler(CommandHandler("stop", cmd_stop))
    app.add_handler(CommandHandler("report", cmd_report))
    app.add_handler(CommandHandler("help", cmd_help))

    logger.info("Bot starting…")
    app.run_polling(drop_pending_updates=True)


if __name__ == "__main__":
    main()
