-- Create table for homepage settings
CREATE TABLE public.homepage_settings (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.homepage_settings ENABLE ROW LEVEL SECURITY;

-- Everyone can view settings
CREATE POLICY "Homepage settings are viewable by everyone"
ON public.homepage_settings
FOR SELECT
USING (true);

-- Only admins can modify
CREATE POLICY "Admins can insert homepage settings"
ON public.homepage_settings
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update homepage settings"
ON public.homepage_settings
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete homepage settings"
ON public.homepage_settings
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger for updated_at
CREATE TRIGGER update_homepage_settings_updated_at
BEFORE UPDATE ON public.homepage_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default values
INSERT INTO public.homepage_settings (id, data) VALUES 
('hero', '{"image_url": "", "title": "Rumor Evening Collection", "subtitle": "new year edition"}'),
('categories', '{"items": [{"name": "NEW", "image_url": ""}, {"name": "Корсеты", "image_url": ""}, {"name": "Платья", "image_url": ""}, {"name": "Комплекты", "image_url": ""}, {"name": "Юбки", "image_url": ""}]}'),
('you_section', '{"items": [{"handle": "@ELENA_STYLE", "image_url": ""}, {"handle": "@FASHION_DIVA", "image_url": ""}, {"handle": "@LUXE_ANNA", "image_url": ""}, {"handle": "@MARIA_GLAM", "image_url": ""}]}');