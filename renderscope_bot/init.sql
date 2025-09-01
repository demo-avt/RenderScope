CREATE TABLE users (
    id          BIGSERIAL PRIMARY KEY,
    tg_id       BIGINT UNIQUE,
    username    TEXT,
    ref_code    TEXT UNIQUE,
    invited_by  BIGINT REFERENCES users(tg_id),
    position    INT UNIQUE,
    pro_until   TIMESTAMPTZ,
    created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE wallet (
    user_id BIGINT PRIMARY KEY REFERENCES users(tg_id),
    stars   INT DEFAULT 0
);

CREATE TABLE ledger (
    id          BIGSERIAL PRIMARY KEY,
    user_id     BIGINT REFERENCES users(tg_id),
    amount_paise INT NOT NULL,
    source      TEXT,
    depth       INT,
    created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE tasks (
    id   SERIAL PRIMARY KEY,
    name TEXT UNIQUE
);
INSERT INTO tasks (name) VALUES
('youtube_subscribe'),
('telegram_join'),
('twitter_follow'),
('instagram_follow'),
('discord_join');

CREATE TABLE completions (
    user_id BIGINT REFERENCES users(tg_id),
    task_id INT REFERENCES tasks(id),
    PRIMARY KEY (user_id, task_id)
);
