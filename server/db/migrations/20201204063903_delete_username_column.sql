-- migrate:up
ALTER TABLE users
  DROP COLUMN username;

-- migrate:down
ALTER TABLE users
  ADD COLUMN username text;
