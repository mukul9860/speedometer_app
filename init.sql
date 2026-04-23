CREATE TABLE speed_data (
id SERIAL PRIMARY KEY,
speed INT NOT NULL,
recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Function to notify on insert
CREATE OR REPLACE FUNCTION notify_new_speed()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM pg_notify('new_speed_channel', row_to_json(NEW)::text);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call the function
CREATE TRIGGER speed_insert_trigger
AFTER INSERT ON speed_data
FOR EACH ROW EXECUTE FUNCTION notify_new_speed();