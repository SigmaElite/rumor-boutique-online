-- =====================================================
-- SECURITY FIX: Restrict guest order access
-- Guest orders should ONLY be accessible via service_role (edge functions)
-- =====================================================

-- Drop current INSERT policies
DROP POLICY IF EXISTS "Users can create their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can create order items for their orders" ON public.order_items;

-- For orders: Only authenticated users can INSERT their own orders
-- Guest orders (user_id = NULL) cannot be created via RLS - only via service_role in edge functions
CREATE POLICY "Authenticated users can create their own orders"
ON public.orders
FOR INSERT
WITH CHECK (
  auth.uid() IS NOT NULL AND user_id = auth.uid()
);

-- For order_items: Only for authenticated user's orders
CREATE POLICY "Users can add items to their own orders"
ON public.order_items
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.orders o
    WHERE o.id = order_id
    AND o.user_id = auth.uid()
    AND auth.uid() IS NOT NULL
  )
);

-- Update SELECT policy for orders: users can only see their own orders
-- Guest orders are NOT visible via RLS - only via edge functions with service_role
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
CREATE POLICY "Users can only view their own orders"
ON public.orders
FOR SELECT
USING (
  auth.uid() IS NOT NULL AND user_id = auth.uid()
);

-- Admins can still see all orders (existing policy remains)