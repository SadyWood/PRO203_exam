-- Add audit fields to health_data table
ALTER TABLE health_data ADD COLUMN last_edited_by UUID;
ALTER TABLE health_data ADD COLUMN last_edited_at TIMESTAMP;