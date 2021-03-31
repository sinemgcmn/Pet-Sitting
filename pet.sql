DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS reset_codes;
DROP TABLE IF EXISTS familysitters;

-- CREATE TYPE status_opt AS ENUM ('sitter', 'family');
CREATE TABLE familysitters(
    id            SERIAL PRIMARY KEY,
    is_family     BOOLEAN DEFAULT false,
    s_address     VARCHAR,
    first_name    VARCHAR NOT NULL CHECK (first_name <> ''),
    last_name     VARCHAR NOT NULL CHECK (last_name <> ''),
    email         VARCHAR NOT NULL UNIQUE CHECK (email <> ''),
    password_hash VARCHAR NOT NULL CHECK (password_hash <> ''),
    services      VARCHAR,
    home          VARCHAR,
    skills        VARCHAR,
    bio           VARCHAR,
    pet           VARCHAR,
    imageurl      VARCHAR,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    lat           DECIMAL,
    lon           DECIMAL,
    rate          DECIMAL DEFAULT 0,
    counter_rate  INT DEFAULT 0
);

CREATE TABLE reset_codes (
    id            SERIAL PRIMARY KEY,
    email         VARCHAR NOT NULL UNIQUE REFERENCES familysitters (email),
    secret_code   VARCHAR NOT NULL,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE messages ( 
    id            SERIAL PRIMARY KEY, 
    sender_id     INT REFERENCES familysitters(id) NOT NULL,
    recipient_id  INT REFERENCES familysitters(id) NOT NULL, 
    info          VARCHAR, 
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

