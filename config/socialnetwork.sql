DROP TABLE IF EXISTS profile_feed;
DROP TABLE IF EXISTS friend_requests;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR NOT NULL,
    last_name VARCHAR NOT NULL,
    email VARCHAR NOT NULL,
    hashed_pw VARCHAR NOT NULL,
    profile_pic_url VARCHAR,
    description VARCHAR,
    hobbies VARCHAR,
    stay_duration VARCHAR,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE friend_requests (
    id SERIAL PRIMARY KEY,
    recipient_id INTEGER NOT NULL,
    sender_id INTEGER NOT NULL,
    status VARCHAR NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE profile_feed (
    id SERIAL PRIMARY KEY,
    profile_id INTEGER NOT NULL,
    sender_id INTEGER NOT NULL,
    message VARCHAR NOT NULL,
    image VARCHAR,
    posted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
