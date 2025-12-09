ALTER TABLE lakshy_76190723.leadstatus
ADD COLUMN created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP;


CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();   -- Update the timestamp when a row is modified
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_timestamp
BEFORE UPDATE ON lakshy_76190723.leadstatus
FOR EACH ROW EXECUTE PROCEDURE set_updated_at();
