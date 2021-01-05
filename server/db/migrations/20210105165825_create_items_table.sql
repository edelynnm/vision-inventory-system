-- migrate:up
CREATE TABLE items (
  item_code int PRIMARY KEY NOT NULL,
  item_brand text NOT NULL,
  item_specs text NOT NULL,
  item_qty int CHECK(item_qty >= 0) NOT NULL,
  item_unit_price numeric NOT NULL,
  item_unit text NOT NULL,
  reorder_point int NOT NULL
);

-- migrate:down

DROP TABLE items;