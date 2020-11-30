-- migrate:up
CREATE TABLE purchase_products (
  purchase_id int REFERENCES purchases(purchase_id) NOT NULL,
  product_code int REFERENCES products(product_code) NOT NULL,
  purchase_product_qty int CHECK(purchase_product_qty >= 0) NOT NULL,
  unit_cost money NOT NULL,
  supplier_name text NOT NULL
);

CREATE INDEX purchase_prod_purchase_id_fkey ON purchase_products (purchase_id);

CREATE INDEX purchase_prod_product_code_fkey ON purchase_products (product_code);

-- migrate:down
DROP INDEX purchase_prod_product_code_fkey;

DROP INDEX purchase_prod_purchase_id_fkey;

DROP TABLE purchase_products;