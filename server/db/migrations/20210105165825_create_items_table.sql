-- migrate:up
CREATE TABLE items (
  item_code bigint PRIMARY KEY NOT NULL,
  item_brand text NOT NULL,
  item_specs text NOT NULL,
  item_qty int CHECK(item_qty >= 0) NOT NULL,
  item_unit_price numeric NOT NULL,
  item_unit text NOT NULL,
  reorder_point int NOT NULL,
  business_id int REFERENCES businesses(business_id) NOT NULL,
  date_time timestamp DEFAULT now()
);

CREATE INDEX items_business_id_fkey ON items(business_id);

-- migrate:down

DROP INDEX items_business_id_fkey;

DROP TABLE items;