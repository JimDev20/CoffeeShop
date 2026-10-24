CREATE TABLE IF NOT EXISTS discount_codes (
  id serial PRIMARY KEY,
  code varchar(50) UNIQUE NOT NULL,
  percent integer NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp NOT NULL DEFAULT now()
);

ALTER TABLE orders ADD COLUMN IF NOT EXISTS discount_code varchar(50);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS discount_amount numeric(10, 2) NOT NULL DEFAULT 0;
