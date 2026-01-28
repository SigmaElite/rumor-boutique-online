-- Drop existing restrictive INSERT policies
DROP POLICY IF EXISTS "Anyone can create orders" ON public.orders;
DROP POLICY IF EXISTS "Allow guest order creation" ON public.orders;
DROP POLICY IF EXISTS "Anyone can insert order items" ON public.order_items;
DROP POLICY IF EXISTS "Allow guest order items creation" ON public.order_items;

-- Create PERMISSIVE INSERT policies for guest checkout
CREATE POLICY "Allow anyone to create orders" 
ON public.orders 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Allow anyone to insert order items" 
ON public.order_items 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);