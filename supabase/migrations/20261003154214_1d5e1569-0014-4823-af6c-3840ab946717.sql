CREATE TABLE public.preorder_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id TEXT,
  product_name TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  size TEXT,
  color TEXT,
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
GRANT INSERT ON public.preorder_requests TO anon;
GRANT SELECT ON public.preorder_requests TO authenticated;
GRANT ALL ON public.preorder_requests TO service_role;
ALTER TABLE public.preorder_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can create preorder" ON public.preorder_requests FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Authenticated can read preorders" ON public.preorder_requests FOR SELECT TO authenticated USING (true);