# RenderScope Telegram Bot

This is the official Telegram bot for the RenderScope Single-Leg Ecosystem.

## Prerequisites

- Python 3.8+
- PostgreSQL

## Setup

1.  **Clone the repository or download the files.**

2.  **Create a virtual environment:**

    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows use `venv\Scripts\activate`
    ```

3.  **Install the dependencies:**

    ```bash
    pip install -r requirements.txt
    ```

4.  **Set up the database:**
    - Make sure you have a PostgreSQL server running.
    - Create a new database for the bot.
    - Run the `init.sql` script to create the necessary tables. You can use a tool like `psql`:
      ```bash
      psql -U your_username -d your_database -f init.sql
      ```

5.  **Configure environment variables:**
    - Make a copy of the `.env.example` file and name it `.env`.
    - Edit the `.env` file with your actual credentials:
      - `BOT_TOKEN`: Your Telegram bot token, which you can get from [BotFather](https://t.me/BotFather).
      - `DATABASE_URL`: Your PostgreSQL connection URL in the format `postgresql+asyncpg://user:password@host:port/dbname`.

## Running the Bot

Once you have completed the setup, you can run the bot with the following command:

```bash
python bot.py
```

The bot will start polling for updates from Telegram.
