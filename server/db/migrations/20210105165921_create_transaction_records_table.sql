-- migrate:up
CREATE TABLE transaction_records (
  transaction_id bigint PRIMARY KEY NOT NULL
);

-- migrate:down
DROP TABLE transaction_records;
