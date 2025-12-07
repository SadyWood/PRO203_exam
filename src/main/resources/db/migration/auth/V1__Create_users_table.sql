-- Users table for authentication
-- Stores OpenID user data and links to Parent/staff profiles

CREATE TABLE users (
    id UUID PRIMARY KEY,
    openId_subject VARCHAR(255) UNIQUE, -- OpenId provider unique ID
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255),
    profile_picture_url VARCHAR(500),
    role VARCHAR(20),
    profile_id UUID -- link to parent staff entity in app database
);

-- Indexes for fast lookups
CREATE INDEX idx_users_email ON users(email); -- Fast email search
CREATE INDEX idx_users_openid_subject ON users(openid_subject); -- Fast OpenID lookup
CREATE INDEX idx_users_profile_id ON users(profile_id); -- Fast profile lookup

