-- migrate:up
ALTER TABLE transactions
  RENAME COLUMN transaction_payment to total;

-- migrate:down

ALTER TABLE transactions
  RENAME COLUMN total to transaction_payment;

