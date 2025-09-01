# ArchVizTrader Telegram Bot

This is the official Telegram bot for the ArchVizTrader ecosystem. It provides users with access to their referral dashboard and other platform features directly from Telegram.

## Features

- **Referral System**: Get your unique referral link to invite others.
- **Dashboard**: View your key statistics, including your global position, downline count, earnings, and stars.
- **Task Verification**: Complete social tasks to earn rewards.
- **Pro Membership**: Upgrade to a Pro account for enhanced benefits.

## Getting Started

You can run this bot using either Docker Compose (recommended) or a local Python environment.

### Prerequisites

- Python 3.8+
- Docker and Docker Compose (for Docker-based setup)
- A Telegram Bot Token from [@BotFather](https://t.me/BotFather)
- A PostgreSQL database

### 1. Configuration

First, you need to set up your environment variables. Copy the example file:

```bash
cp .env.example .env
```

Now, edit the `.env` file with your specific configuration:

- `BOT_TOKEN`: Your Telegram bot token.
- `DATABASE_URL`: The connection string for your PostgreSQL database.
  - Format: `postgresql+asyncpg://<user>:<password>@<host>:<port>/<dbname>`

If you are using the provided Docker Compose setup, the `DATABASE_URL` should be:
`DATABASE_URL=postgresql+asyncpg://archviztrader:password@db:5432/archviztrader`

And you should also set the PostgreSQL credentials in the `.env` file:
- `POSTGRES_USER=archviztrader`
- `POSTGRES_PASSWORD=password`
- `POSTGRES_DB=archviztrader`

### 2. Running the Bot

#### With Docker Compose (Recommended)

This is the easiest way to get started. It will spin up both the bot and a PostgreSQL database container.

1.  **Build and run the containers:**
    ```bash
    docker-compose up --build
    ```

2.  **To run in the background:**
    ```bash
    docker-compose up -d --build
    ```

3.  **To stop the containers:**
    ```bash
    docker-compose down
    ```

#### With a Local Python Environment

If you prefer not to use Docker, you can run the bot directly on your machine.

1.  **Set up a virtual environment (optional but recommended):**
    ```bash
    python3 -m venv venv
    source venv/bin/activate
    ```

2.  **Install the required dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

3.  **Ensure your PostgreSQL database is running and accessible.**

4.  **Run the bot:**
    ```bash
    python bot.py
    ```

## Database

The `init.sql` file contains the necessary schema for the bot. If you are using the Docker Compose setup, this script will be run automatically when the database container is first created. If you are setting up your database manually, you will need to execute the contents of this file against your database.
