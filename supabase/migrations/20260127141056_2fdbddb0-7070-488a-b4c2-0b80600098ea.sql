-- Drop old restrictive INSERT policy
DROP POLICY IF EXISTS "Users can insert their own orders" ON public.orders;

-- Create new PERMISSIVE INSERT policy for guest checkout
CREATE POLICY "Anyone can create orders"
ON public.orders
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Drop old restrictive INSERT policy for order_items
DROP POLICY IF EXISTS "Users can insert order items for their orders" ON public.order_items;

-- Create new PERMISSIVE INSERT policy for order_items
CREATE POLICY "Anyone can insert order items"
ON public.order_items
FOR INSERT
TO anon, authenticated
WITH CHECK (true);