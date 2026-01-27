import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Generate MD5 hash
async function md5(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('MD5', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { orderId } = await req.json();

    if (!orderId) {
      return new Response(
        JSON.stringify({ error: 'Order ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const wsbStoreId = Deno.env.get('WSB_STOREID')!;
    const wsbSecretKey = Deno.env.get('WSB_SECRET_KEY')!;

    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get order details
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      return new Response(
        JSON.stringify({ error: 'Order not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get order items
    const { data: orderItems, error: itemsError } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', orderId);

    if (itemsError) {
      return new Response(
        JSON.stringify({ error: 'Failed to get order items' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate seed (timestamp)
    const seed = Date.now().toString();

    // Calculate total
    const total = order.total_price.toFixed(2);

    // Order number (first 8 chars of UUID uppercased)
    const orderNum = `ORDER-${orderId.slice(0, 8).toUpperCase()}`;

    // Generate signature: md5(seed + wsb_storeid + wsb_order_num + wsb_test + wsb_currency_id + wsb_total + wsb_secret_key)
    const signatureString = `${seed}${wsbStoreId}${orderNum}1BYN${total}${wsbSecretKey}`;
    const signature = await md5(signatureString);

    // Prepare items for WebPay
    const wsbItems = orderItems?.map((item, index) => ({
      name: item.product_name + (item.size ? ` (${item.size})` : '') + (item.color ? ` - ${item.color}` : ''),
      quantity: item.quantity,
      price: item.product_price.toFixed(2),
    })) || [];

    // Return URL (production domain)
    const returnUrl = 'https://rumor-chic-style.lovable.app/order-success';
    const cancelUrl = 'https://rumor-chic-style.lovable.app/catalog';

    // Build payment form data
    const paymentData = {
      action: 'https://securesandbox.webpay.by/', // Use production URL: https://payment.webpay.by/ for live
      wsb_version: '2',
      wsb_language_id: 'russian',
      wsb_storeid: wsbStoreId,
      wsb_store: 'RUMOR',
      wsb_order_num: orderNum,
      wsb_test: '1', // Set to '0' for production
      wsb_currency_id: 'BYN',
      wsb_seed: seed,
      wsb_customer_name: order.customer_name,
      wsb_customer_address: order.delivery_address,
      wsb_return_url: returnUrl,
      wsb_cancel_return_url: cancelUrl,
      wsb_email: order.customer_email,
      wsb_phone: order.customer_phone.replace(/[^0-9]/g, ''),
      wsb_total: total,
      wsb_signature: signature,
      items: wsbItems,
    };

    return new Response(
      JSON.stringify(paymentData),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('WebPay error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
