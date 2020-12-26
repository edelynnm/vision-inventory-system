-- migrate:up
CREATE TABLE items (
  item_code int PRIMARY KEY NOT NULL,
  item_category_code int REFERENCES categories (category_code) NOT NULL,
  item_brand text NOT NULL,
  item_specs text NOT NULL,
  item_qty int CHECK(item_qty >= 0) NOT NULL,
  item_unit_price money NOT NULL, --change to numeric
  item_unit text NOT NULL DEFAULT 'UNIT',
  reorder_point int NOT NULL DEFAULT 0
);

CREATE INDEX item_category_code_fkey ON items (item_category_code);

-- migrate:down
DROP INDEX item_category_code_fkey;

DROP TABLE items;