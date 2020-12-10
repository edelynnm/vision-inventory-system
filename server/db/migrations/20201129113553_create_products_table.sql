-- migrate:up
CREATE TABLE products (
  product_code int PRIMARY KEY NOT NULL,
  product_category_code int REFERENCES categories (category_code) NOT NULL,
  product_brand text NOT NULL,
  product_specs text NOT NULL,
  product_qty int CHECK(product_qty >= 0) NOT NULL,
  product_unit_price money NOT NULL,
  reorder_point int NOT NULL DEFAULT 0
);

CREATE INDEX product_category_code_fkey ON products (product_category_code);

-- migrate:down
DROP INDEX product_category_code_fkey;

DROP TABLE products;