-- migrate:up
INSERT INTO users (user_role_id, user_business_id, username, password, fname, lname, email)
  VALUES (1, 1, 'admin', 'adminpass', 'Baden', 'Mallare', 'badz0421691@gmail.com');

-- migrate:down
DELETE FROM users WHERE user_id = 1;
