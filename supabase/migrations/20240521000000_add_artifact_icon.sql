-- Add icon column to artifacts table
ALTER TABLE artifacts ADD COLUMN IF NOT EXISTS icon TEXT;
