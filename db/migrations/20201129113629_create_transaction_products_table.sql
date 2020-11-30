-- migrate:up
CREATE TABLE transaction_products (
  transaction_id int REFERENCES transactions(transaction_id) NOT NULL,
  product_code int REFERENCES products(product_code) NOT NULL,
  bought_qty int CHECK(bought_qty >= 0) NOT NULL
);

CREATE INDEX transction_prod_transaction_id_fkey ON transaction_products (transaction_id);

CREATE INDEX transction_prod_product_code_fkey ON transaction_products (product_code);

-- migrate:down
DROP INDEX transction_prod_product_code_fkey;

DROP INDEX transction_prod_transaction_id_fkey;

DROP TABLE transaction_products;