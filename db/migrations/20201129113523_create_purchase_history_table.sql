-- migrate:up
CREATE TABLE purchase_history (
  purchase_id int REFERENCES purchases (purchase_id) NOT NULL
);

CREATE INDEX purchase_history_purchase_id_fkey ON purchase_history (purchase_id);

-- migrate:down
DROP INDEX purchase_history_purchase_id_fkey;

DROP TABLE purchase_history;