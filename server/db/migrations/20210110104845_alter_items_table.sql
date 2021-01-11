-- migrate:up
ALTER TABLE items 
  ADD COLUMN business_id int REFERENCES businesses(business_id) NOT NULL,
  ADD COLUMN date_time timestamp DEFAULT now();


CREATE INDEX items_business_id_fkey ON items (business_id);

-- migrate:down

DROP INDEX items_business_id_fkey;

ALTER TABLE items
  DROP COLUMN business_id,
  DROP COLUMN date_time;


