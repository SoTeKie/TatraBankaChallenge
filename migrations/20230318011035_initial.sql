-- Add migration script here
CREATE TABLE users (
    user_id uuid PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash CHAR(256) DEFAULT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL
);

CREATE TABLE posts (
    post_id uuid PRIMARY KEY,
    user_id uuid NOT NULL,
    title VARCHAR(100) NOT NULL,
    content VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (user_id)
);
