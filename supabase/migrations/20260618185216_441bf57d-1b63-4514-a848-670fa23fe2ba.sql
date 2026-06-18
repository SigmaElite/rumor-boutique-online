UPDATE public.homepage_settings
SET data = jsonb_set(
  data,
  '{items}',
  data->'items' || '{"name": "wedding collection", "image_url": ""}'::jsonb
)
WHERE id = 'categories';