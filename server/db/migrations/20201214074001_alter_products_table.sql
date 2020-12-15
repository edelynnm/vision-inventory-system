-- migrate:up
ALTER TABLE products
  ADD COLUMN product_unit text NOT NULL DEFAULT 'UNIT';

-- migrate:down
ALTER TABLE products
  DROP COLUMN product_unit;
