-- migrate:up
INSERT INTO roles (title, description)
  VALUES
  ('ADMIN', 'The boss/business owner.'),
  ('CASHIER', 'In-charge of the cash register and caters the customer''s purchases.'),
  ('INVENTORY MANAGER', 'Manage the inventory and restocks items when needed.')
;

-- migrate:down
DELETE FROM roles WHERE title IN ('ADMIN', 'CASHIER', 'INVENTORY MANAGER');
