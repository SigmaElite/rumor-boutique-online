-- Allow guest checkout by permitting inserts with null user_id
CREATE POLICY "Allow guest order creation" 
ON public.orders 
FOR INSERT 
WITH CHECK (user_id IS NULL OR auth.uid() = user_id);

-- Also allow guest order items creation
CREATE POLICY "Allow guest order items creation" 
ON public.order_items 
FOR INSERT 
WITH CHECK (true);