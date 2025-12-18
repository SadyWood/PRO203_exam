-- Add is_special_occasion column to calendar_events table
-- Used to flag special events like trips, birthdays, planning days, etc.

ALTER TABLE calendar_events
    ADD COLUMN is_special_occasion BOOLEAN NOT NULL DEFAULT FALSE;
