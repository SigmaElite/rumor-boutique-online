-- Add position column for product ordering in catalog
ALTER TABLE public.products ADD COLUMN position integer NOT NULL DEFAULT 0;