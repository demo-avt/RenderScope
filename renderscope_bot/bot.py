import os, secrets, logging
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import Application, CommandHandler, CallbackQueryHandler, ContextTypes
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy import select, func, insert, Column, BigInteger, String, Integer, DateTime
from sqlalchemy.sql import func as sql_func
from sqlalchemy.orm import declarative_base

BOT_TOKEN   = "8497978831:AAGuzz_9NAGJFpXYnXwdJMezlvdHHBjlsaM"
DATABASE_URL= os.getenv("DATABASE_URL")
PLATFORM_FEE_PAISE = int(os.getenv("PLATFORM_FEE_PAISE", 50))
REFERRAL_STARS     = int(os.getenv("REFERRAL_STARS", 5))
DEPTH_LIMIT        = int(os.getenv("DEPTH_LIMIT", 10))
LEVEL_BONUS        = int(os.getenv("LEVEL_BONUS", 1))
PRO_PRICE          = int(os.getenv("PRO_PRICE", 49900))

logging.basicConfig(level=logging.INFO)
engine = create_async_engine(DATABASE_URL, echo=False)
async_session = async_sessionmaker(engine, expire_on_commit=False)
Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(BigInteger, primary_key=True)
    tg_id = Column(BigInteger, unique=True)
    username = Column(String)
    ref_code = Column(String, unique=True)
    invited_by = Column(BigInteger)
    position = Column(Integer, unique=True)
    pro_until = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=sql_func.now())

class Wallet(Base):
    __tablename__ = "wallet"
    user_id = Column(BigInteger, primary_key=True)
    stars = Column(Integer, default=0)

class Ledger(Base):
    __tablename__ = "ledger"
    id = Column(BigInteger, primary_key=True)
    user_id = Column(BigInteger)
    amount_paise = Column(Integer)
    source = Column(String)
    depth = Column(Integer)

# helpers
async def get_or_create_user(session, tg_id, ref_code_link):
    res = await session.execute(select(User).where(User.tg_id == tg_id))
    user = res.scalar_one_or_none()
    if user: return user, False
    max_pos = await session.scalar(select(func.max(User.position)))
    next_pos = (max_pos or 0) + 1
    ref_code = secrets.token_urlsafe(8)
    invited_by = None
    if ref_code_link:
        sponsor = await session.scalar(select(User).where(User.ref_code == ref_code_link))
        if sponsor: invited_by = sponsor.tg_id
    user = User(tg_id=tg_id, username=str(tg_id), ref_code=ref_code, invited_by=invited_by, position=next_pos)
    session.add(user)
    await session.flush()
    await session.execute(insert(Wallet).values(user_id=tg_id).on_conflict_do_nothing())
    return user, True

async def credit_paise(session, uid, paise, src, d=None):
    await session.execute(insert(Ledger).values(user_id=uid, amount_paise=paise, source=src, depth=d))
async def credit_stars(session, uid, stars):
    await session.execute(insert(Wallet).values(user_id=uid, stars=stars).on_conflict_do_update(
        index_elements=["user_id"], set_=dict(stars=Wallet.stars + stars)))

# handlers
async def start(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    ref = ctx.args[0] if ctx.args else None
    async with async_session() as s:
        user, _ = await get_or_create_user(s, update.effective_user.id, ref)
        await s.commit()
    kb = InlineKeyboardMarkup([
        [InlineKeyboardButton("🔗 My Referral Link", callback_data="link")],
        [InlineKeyboardButton("📊 Dashboard", callback_data="dash")],
        [InlineKeyboardButton("🎯 Verify Tasks", callback_data="verify")],
        [InlineKeyboardButton("🛒 ₹499 Pro", callback_data="pro")]
    ])
    await update.message.reply_text(
        f"👋 Position #{user.position}\n🔗 Link: https://t.me/YourBot?start={user.ref_code}",
        reply_markup=kb)

async def dashboard(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    async with async_session() as s:
        u = await s.scalar(select(User).where(User.tg_id == update.effective_user.id))
        w = await s.scalar(select(Wallet).where(Wallet.user_id == update.effective_user.id))
        total = await s.scalar(select(func.sum(Ledger.amount_paise)).where(Ledger.user_id == update.effective_user.id))
        total = total or 0
        downline = await s.scalar(select(func.count()).select_from(User).where(User.position > u.position))
    await update.callback_query.message.edit_text(
        f"📊 **Dashboard**\n"
        f"Global Position: #{u.position}\n"
        f"Downline Users: {downline}\n"
        f"₹ Earned: ₹{total/100:.2f}\n"
        f"Stars: {w.stars}\n"
        f"Referral Link: https://t.me/YourBot?start={u.ref_code}",
        reply_markup=InlineKeyboardMarkup([[InlineKeyboardButton("« Back", callback_data="back")]])
    )

def main():
    app = Application.builder().token(BOT_TOKEN).build()
    app.add_handler(CommandHandler("start", start))
    app.add_handler(CallbackQueryHandler(dashboard, pattern="^dash$"))
    app.run_polling()

if __name__ == "__main__":
    main()
