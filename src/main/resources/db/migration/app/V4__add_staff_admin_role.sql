-- Add is_admin flag to staff (kindergarten-level admin)
ALTER TABLE staff ADD COLUMN is_admin BOOLEAN NOT NULL DEFAULT false;