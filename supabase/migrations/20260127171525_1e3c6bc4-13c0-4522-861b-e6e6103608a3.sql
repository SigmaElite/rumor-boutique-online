-- Drop existing insert policies and recreate with correct roles
DROP POLICY IF EXISTS "Anyone can create orders" ON public.orders;
DROP POLICY IF EXISTS "Anyone can insert order items" ON public.order_items;

-- Create policies that allow ANY role (including anon/public) to insert
CREATE POLICY "Anyone can create orders"
ON public.orders
FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Anyone can insert order items"
ON public.order_items
FOR INSERT
TO public
WITH CHECK (true);