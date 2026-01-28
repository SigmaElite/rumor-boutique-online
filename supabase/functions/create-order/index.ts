import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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
  total_price: number;
  items: OrderItem[];
}

serve(async (req) => {
  console.log('=== EDGE FUNCTION: create-order started ===');
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body: OrderRequest = await req.json();
    console.log('Request body:', JSON.stringify(body));

    const { customer_name, customer_email, customer_phone, total_price, items } = body;

    if (!customer_name || !customer_email || !customer_phone || !total_price || !items?.length) {
      console.log('ERROR: Missing required fields');
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    // Use service role key to bypass RLS
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('Creating order...');
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: null,
        total_price,
        customer_name,
        customer_email,
        customer_phone,
        delivery_address: 'Уточняется',
        delivery_method: 'delivery',
        payment_method: 'webpay',
      })
      .select()
      .single();

    if (orderError) {
      console.log('ERROR creating order:', orderError);
      return new Response(
        JSON.stringify({ error: 'Failed to create order', details: orderError }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Order created:', order.id);

    // Create order items
    const orderItems = items.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      product_name: item.product_name,
      product_price: item.product_price,
      quantity: item.quantity,
      size: item.size || null,
      color: item.color || null,
    }));

    console.log('Creating order items:', orderItems);
    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.log('ERROR creating order items:', itemsError);
      return new Response(
        JSON.stringify({ error: 'Failed to create order items', details: itemsError }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Order items created successfully');
    console.log('=== Order creation complete, returning order ID ===');

    return new Response(
      JSON.stringify({ orderId: order.id }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('=== EDGE FUNCTION ERROR ===');
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: String(error) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
