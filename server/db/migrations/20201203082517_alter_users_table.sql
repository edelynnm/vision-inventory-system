-- migrate:up
ALTER TABLE users
  ADD COLUMN verification_token text NOT NULL;

-- migrate:down
ALTER TABLE users
  DROP COLUMN verification_token;
