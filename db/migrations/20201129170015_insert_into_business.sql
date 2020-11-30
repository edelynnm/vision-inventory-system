-- migrate:up
INSERT INTO businesses (business_name, business_code)
  VALUES ('BNE Computer Sales and Services', '042169Badz');

-- migrate:down
DELETE FROM businesses WHERE business_name = 'BNE Computer Sales and Services';
