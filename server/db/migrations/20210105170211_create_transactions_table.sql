-- migrate:up
CREATE TABLE transactions (
  transaction_id bigint REFERENCES transaction_records (transaction_id) NOT NULL,
  transaction_user_id int REFERENCES users(user_id) NOT NULL,
  transaction_date_time timestamp DEFAULT now(),
  total numeric NOT NULL
);

CREATE INDEX transaction_id_fkey ON transactions (transaction_id);

CREATE INDEX transaction_user_id_fkey ON transactions (transaction_user_id);

-- migrate:down

DROP INDEX transaction_id_fkey;

DROP INDEX transaction_user_id_fkey;

DROP TABLE transactions;