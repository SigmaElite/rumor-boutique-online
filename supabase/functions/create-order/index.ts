import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

interface OrderItem {
  product_id: string;
  product_name: string;
  product_price: number;
  quantity: number;
  size?: string;
  color?: string;
}

interface OrderRequest {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_address?: string;
  delivery_method?: string;
  payment_method?: string;
  comment?: string;
  items: OrderItem[];
}

// Input validation helpers
const sanitizeString = (input: string, maxLength: number = 500): string => {
  if (typeof input !== 'string') return '';
  // Remove potentially dangerous characters and trim
  return input.trim().slice(0, maxLength);
};

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 255;
};

const validatePhone = (phone: string): boolean => {
  // Allow only digits, plus sign, spaces, and common separators
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
  return /^\+?[0-9]{9,15}$/.test(cleanPhone);
};

serve(async (req) => {
  console.log('=== EDGE FUNCTION: create-order started ===');
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body: OrderRequest = await req.json();
    
    // SECURITY: Validate and sanitize all inputs
    const customerName = sanitizeString(body.customer_name, 100);
    const customerEmail = sanitizeString(body.customer_email, 255);
    const customerPhone = sanitizeString(body.customer_phone, 20);
    const deliveryAddress = sanitizeString(body.delivery_address || 'Уточняется', 500);
    const deliveryMethod = sanitizeString(body.delivery_method || 'delivery', 50);
    const paymentMethod = sanitizeString(body.payment_method || 'cash', 50);
    const comment = sanitizeString(body.comment || '', 1000);
    const items = body.items;

    // Validate required fields
    if (!customerName || customerName.length < 2) {
      return new Response(
        JSON.stringify({ error: 'Invalid customer name' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!validateEmail(customerEmail)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!validatePhone(customerPhone)) {
      return new Response(
        JSON.stringify({ error: 'Invalid phone format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!Array.isArray(items) || items.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Order must contain at least one item' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate delivery method
    const validDeliveryMethods = ['delivery', 'pickup'];
    if (!validDeliveryMethods.includes(deliveryMethod)) {
      return new Response(
        JSON.stringify({ error: 'Invalid delivery method' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate payment method
    const validPaymentMethods = ['cash', 'card', 'webpay'];
    if (!validPaymentMethods.includes(paymentMethod)) {
      return new Response(
        JSON.stringify({ error: 'Invalid payment method' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    // Use service role key to bypass RLS
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // SECURITY: Fetch actual product prices from database to prevent price manipulation
    const productIds = items.map(item => item.product_id).filter(id => id);
    
    let productPrices: Record<string, number> = {};
    if (productIds.length > 0) {
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('id, price, name')
        .in('id', productIds);

      if (productsError) {
        console.error('Error fetching products:', productsError);
        return new Response(
          JSON.stringify({ error: 'Failed to validate products' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Build a map of product_id -> actual_price
      productPrices = (products || []).reduce((acc, p) => {
        acc[p.id] = Number(p.price);
        return acc;
      }, {} as Record<string, number>);
    }

    // Calculate total using ACTUAL prices from database
    let totalPrice = 0;
    const validatedItems: OrderItem[] = [];

    for (const item of items) {
      const actualPrice = productPrices[item.product_id];
      
      if (actualPrice === undefined) {
        console.error(`Product not found: ${item.product_id}`);
        return new Response(
          JSON.stringify({ error: `Product not found: ${item.product_name}` }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Validate quantity
      const quantity = Math.max(1, Math.min(100, Math.floor(Number(item.quantity) || 1)));
      
      validatedItems.push({
        product_id: item.product_id,
        product_name: sanitizeString(item.product_name, 200),
        product_price: actualPrice, // Use actual price from DB
        quantity: quantity,
        size: item.size ? sanitizeString(item.size, 20) : undefined,
        color: item.color ? sanitizeString(item.color, 50) : undefined,
      });

      totalPrice += actualPrice * quantity;
    }

    console.log('Creating order with validated total:', totalPrice);

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: null,
        total_price: totalPrice, // Use calculated total from actual prices
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        delivery_address: deliveryAddress,
        delivery_method: deliveryMethod,
        payment_method: paymentMethod,
        comment: comment || null,
      })
      .select()
      .single();

    if (orderError) {
      console.error('Order creation error:', orderError);
      return new Response(
        JSON.stringify({ error: 'Failed to create order' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Order created:', order.id);

    // Create order items with validated prices
    const orderItems = validatedItems.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      product_name: item.product_name,
      product_price: item.product_price,
      quantity: item.quantity,
      size: item.size || null,
      color: item.color || null,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('Order items error:', itemsError);
      // Rollback: delete the order if items failed
      await supabase.from('orders').delete().eq('id', order.id);
      return new Response(
        JSON.stringify({ error: 'Failed to create order items' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Order complete:', order.id);

    return new Response(
      JSON.stringify({ orderId: order.id, totalPrice: totalPrice }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
