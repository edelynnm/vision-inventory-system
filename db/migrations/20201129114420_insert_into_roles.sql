-- migrate:up
INSERT INTO roles (role_title, role_desc)
  VALUES
  ('ADMIN', 'The boss/business owner.'),
  ('CASHIER', 'In-charge of the cash register and caters the customer''s purchases.'),
  ('STOCK EMPLOYEE', 'Monitors the stocks, processes the purchases and restocks products in your inventory.'),
  ('SALES MANAGER', 'Manage the sales and oversees the sales department of your business.'),
  ('STOCK MANAGER', 'Manage the stocks and oversees the stocks department of your business.')
;

-- migrate:down
DELETE FROM roles WHERE role_title IN ('ADMIN', 'CASHIER', 'STOCK EMPLOYEE', 'SALES MANAGER', 'STOCK MANAGER');
