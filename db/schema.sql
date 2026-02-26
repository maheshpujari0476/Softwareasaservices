-- CREATE TABLE IF NOT EXISTS users(
--     id SERIAL PRIMARY KEY,
--     name VARCHAR(100) NOT NULL,
--     email VARCHAR(100) UNIQUE NOT NULL,
--     password TEXT NOT NULL,
--     role varchar(20) DEFAULT 'user',
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- CREATE TABLE IF NOT EXISTS audit_logs(
--     id SERIAL PRIMARY KEY,
--     user_id INTEGER  REFERENCES users(id) ON DELETE CASCADE,
--     action VARCHAR(255),
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- CREATE TABLE IF NOT EXISTS profile_logs(
--     id SERIAL PRIMARY KEY,
--     user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
--     name VARCHAR(50),
--     email VARCHAR(100) UNIQUE NOT NULL,
--     role varchar(20) default 'user',
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- )

-- CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

-- -- demo table for api testing


-- CREATE TABLE IF NOT EXISTS userstest(
--     id SERIAL PRIMARY KEY,
--     name VARCHAR(100) NOT NULL,
--     email VARCHAR(100) NOT NULL,
--     password TEXT NOT NULL,
--     role varchar(20) DEFAULT 'user',
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );



-- new Project To Become the SDE-2 in any condition


-- table for user
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- table for workspace
CREATE TABLE workspaces (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  owner_id UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);