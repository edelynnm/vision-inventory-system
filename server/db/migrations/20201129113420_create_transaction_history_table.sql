-- migrate:up
CREATE TABLE transaction_history (
  transaction_id int REFERENCES transactions (transaction_id) NOT NULL
);

CREATE INDEX trans_history_transaction_id_fkey ON transaction_history (transaction_id);

-- migrate:down
DROP INDEX trans_history_transaction_id_fkey;

DROP TABLE transaction_history;