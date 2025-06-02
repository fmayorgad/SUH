-- Migration: Add signature column to users table
-- Date: 2024-06-02
-- Description: Adds a signature column to store file paths for user signature images

ALTER TABLE IF EXISTS public.users 
ADD COLUMN IF NOT EXISTS signature character varying(500);

-- Add comment to the column
COMMENT ON COLUMN public.users.signature IS 'File path to user signature image'; 