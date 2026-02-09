
-- Add is_last_sizes flag to products
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_last_sizes boolean DEFAULT false;

-- Add secondary_category to allow product in two categories
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS secondary_category text DEFAULT null;
