-- Add color_images column to store per-color image URLs as a JSON object
-- e.g. {"черный": "https://...", "белый": "https://..."}
ALTER TABLE public.products ADD COLUMN color_images jsonb DEFAULT '{}'::jsonb;