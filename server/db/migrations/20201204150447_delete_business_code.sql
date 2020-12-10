-- migrate:up
ALTER TABLE businesses
  DROP COLUMN business_code;

-- migrate:down
ALTER TABLE businesses
  ADD COLUMN business_code text;
