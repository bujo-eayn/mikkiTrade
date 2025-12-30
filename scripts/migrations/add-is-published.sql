-- Add is_published column to vehicles table
-- This allows vehicles to be saved as drafts and published later

-- Add the column with default value false
ALTER TABLE vehicles
ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT false;

-- Create an index for better query performance
CREATE INDEX IF NOT EXISTS idx_vehicles_is_published ON vehicles(is_published);

-- Create a combined index for common queries (published + status)
CREATE INDEX IF NOT EXISTS idx_vehicles_published_status ON vehicles(is_published, status) WHERE deleted_at IS NULL;

-- Update published_at timestamp when is_published is set to true
-- This trigger will automatically set published_at when a vehicle is published
CREATE OR REPLACE FUNCTION set_published_at()
RETURNS TRIGGER AS $$
BEGIN
  -- If is_published changed from false to true, set published_at
  IF NEW.is_published = true AND (OLD.is_published = false OR OLD.is_published IS NULL) THEN
    NEW.published_at = NOW();
  END IF;

  -- If unpublished, clear published_at
  IF NEW.is_published = false AND OLD.is_published = true THEN
    NEW.published_at = NULL;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS trigger_set_published_at ON vehicles;
CREATE TRIGGER trigger_set_published_at
  BEFORE UPDATE ON vehicles
  FOR EACH ROW
  EXECUTE FUNCTION set_published_at();

-- Add comment for documentation
COMMENT ON COLUMN vehicles.is_published IS 'Whether the vehicle is published and visible to the public. Drafts have is_published=false';
