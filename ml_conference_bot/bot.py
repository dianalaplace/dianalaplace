"""Telegram bot handlers."""
import logging

from telegram import Update
from telegram.constants import ParseMode
from telegram.ext import ContextTypes

import storage
import formatter
import agent

logger = logging.getLogger(__name__)


async def cmd_start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    chat_id = update.effective_chat.id
    is_new = await storage.add_subscriber(chat_id)
    if is_new:
        await update.message.reply_text(
            formatter.format_welcome(), parse_mode=ParseMode.HTML, disable_web_page_preview=True
        )
    else:
        await update.message.reply_text(
            "✅ You're already subscribed! Use /report to get events now.",
            parse_mode=ParseMode.HTML,
        )


async def cmd_stop(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    chat_id = update.effective_chat.id
    await storage.remove_subscriber(chat_id)
    await update.message.reply_text(
        "🛑 Unsubscribed. You won't receive daily reports.\n"
        "Send /start any time to re-subscribe."
    )


async def cmd_report(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Send the most recently stored events on demand."""
    chat_id = update.effective_chat.id
    await update.message.reply_text("🔍 Fetching latest events… this may take a minute.")

    try:
        # Run the agent live for a fresh pull
        events = await agent.find_events()
        new_events = await storage.save_events(events)

        # If agent returned nothing new, fall back to stored
        if not events:
            events = await storage.get_recent_events(limit=20)
            is_new = False
        else:
            is_new = bool(new_events)

        chunks = formatter.format_report(events, is_new=is_new)
        for chunk in chunks:
            await context.bot.send_message(
                chat_id=chat_id,
                text=chunk,
                parse_mode=ParseMode.HTML,
                disable_web_page_preview=True,
            )
    except Exception as exc:
        logger.exception("Error in /report for chat %s", chat_id)
        await update.message.reply_text(
            f"⚠️ Something went wrong: {exc}\nPlease try again later."
        )


async def cmd_help(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    await update.message.reply_text(
        formatter.format_welcome(), parse_mode=ParseMode.HTML, disable_web_page_preview=True
    )


# ── Scheduled daily job ───────────────────────────────────────────────────────

async def daily_report_job(context: ContextTypes.DEFAULT_TYPE) -> None:
    """Called by the job queue every day at the configured time."""
    logger.info("Running daily report job")
    subscribers = await storage.get_subscribers()
    if not subscribers:
        logger.info("No subscribers, skipping report")
        return

    try:
        events = await agent.find_events()
        new_events = await storage.save_events(events)
    except Exception:
        logger.exception("Agent failed during daily job")
        return

    if not new_events:
        logger.info("No new events found today")
        return

    chunks = formatter.format_report(new_events, is_new=True)
    for chat_id in subscribers:
        try:
            for chunk in chunks:
                await context.bot.send_message(
                    chat_id=chat_id,
                    text=chunk,
                    parse_mode=ParseMode.HTML,
                    disable_web_page_preview=True,
                )
        except Exception:
            logger.exception("Failed to send daily report to %s", chat_id)
