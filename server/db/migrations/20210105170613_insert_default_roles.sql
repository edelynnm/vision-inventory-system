-- migrate:up
INSERT INTO roles (role_title, role_desc)
  VALUES
  ('ADMIN', 'The boss/business owner.'),
  ('CASHIER', 'In-charge of the cash register and caters the customer''s purchases.'),
  ('INVENTORY MANAGER', 'Manage the inventory and restocks items when needed.')
;

-- migrate:down
DELETE FROM roles WHERE role_title IN ('ADMIN', 'CASHIER', 'INVENTORY MANAGER');
