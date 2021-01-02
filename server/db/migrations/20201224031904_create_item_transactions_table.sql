-- migrate:up
CREATE TABLE item_transactions (
  transaction_id bigint REFERENCES transaction_records (transaction_id) NOT NULL, 
  item_code int NOT NULL,
  qty int NOT NULL,
  total_price numeric NOT NULL
);

CREATE INDEX item_transactions_id_fkey ON item_transactions (transaction_id)

-- migrate:down
DROP INDEX item_transactions_id_fkey;

DROP TABLE item_transactions;