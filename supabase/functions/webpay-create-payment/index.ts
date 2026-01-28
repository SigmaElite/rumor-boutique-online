import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};


serve(async (req) => {
  console.log('=== EDGE FUNCTION: webpay-create-payment started ===');
  
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    console.log('CORS preflight request');
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    console.log('Request body:', JSON.stringify(body));
    
    const { orderId } = body;

    if (!orderId) {
      console.log('ERROR: No orderId provided');
      return new Response(
        JSON.stringify({ error: 'Order ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Processing order:', orderId);

    // Get environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const wsbStoreId = '554332557';
    const wsbSecretKey = '1';

    console.log('Supabase URL:', supabaseUrl);
    console.log('Store ID:', wsbStoreId);

    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get order details
    console.log('Fetching order from database...');
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (orderError) {
      console.log('ERROR fetching order:', orderError);
      return new Response(
        JSON.stringify({ error: 'Order not found', details: orderError }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!order) {
      console.log('ERROR: Order is null');
      return new Response(
        JSON.stringify({ error: 'Order not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Order found:', JSON.stringify(order));

    // Get order items
    console.log('Fetching order items...');
    const { data: orderItems, error: itemsError } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', orderId);

    if (itemsError) {
      console.log('ERROR fetching order items:', itemsError);
      return new Response(
        JSON.stringify({ error: 'Failed to get order items', details: itemsError }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Order items:', JSON.stringify(orderItems));

    // Generate seed (timestamp)
    const seed = Date.now().toString();
    console.log('Generated seed:', seed);

    // Calculate total
    const total = order.total_price.toFixed(2);
    console.log('Total price:', total);

    // Order number (first 8 chars of UUID uppercased)
    const orderNum = `ORDER-${orderId.slice(0, 8).toUpperCase()}`;
    console.log('Order number:', orderNum);

    // Generate signature: sha1(seed + wsb_storeid + wsb_order_num + wsb_test + wsb_currency_id + wsb_total + wsb_secret_key)
    const signatureString = `${seed}${wsbStoreId}${orderNum}1BYN${total}${wsbSecretKey}`;
    console.log('Signature string:', signatureString);
    
    // Use SHA1 for signature
    const msgBuffer = new TextEncoder().encode(signatureString);
    const hashBuffer = await crypto.subtle.digest('SHA-1', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const signature = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    console.log('Generated signature:', signature);

    // URLs
    const baseUrl = 'https://rumor-chic-style.lovable.app';
    const returnUrl = `${baseUrl}/order-success`;
    const cancelUrl = `${baseUrl}/catalog`;
    const notifyUrl = `${supabaseUrl}/functions/v1/webpay-webhook`;

    console.log('Return URL:', returnUrl);
    console.log('Cancel URL:', cancelUrl);
    console.log('Notify URL:', notifyUrl);

    // Build payment form data with invoice items in correct format
    const paymentData: Record<string, string> = {
      action: 'https://securesandbox.webpay.by/',
      wsb_version: '2',
      wsb_language_id: 'russian',
      wsb_storeid: wsbStoreId,
      wsb_store: 'RUMOR',
      wsb_order_num: orderNum,
      wsb_test: '1',
      wsb_currency_id: 'BYN',
      wsb_seed: seed,
      wsb_customer_name: order.customer_name,
      wsb_customer_address: order.delivery_address,
      wsb_return_url: returnUrl,
      wsb_cancel_return_url: cancelUrl,
      wsb_notify_url: notifyUrl,
      wsb_email: order.customer_email,
      wsb_phone: order.customer_phone.replace(/[^0-9]/g, ''),
      wsb_total: total,
      wsb_signature: signature,
    };

    // Add invoice items in correct format: wsb_invoice_item_name[0], wsb_invoice_item_quantity[0], etc.
    orderItems?.forEach((item, index) => {
      const itemName = item.product_name + (item.size ? ` (${item.size})` : '') + (item.color ? ` - ${item.color}` : '');
      paymentData[`wsb_invoice_item_name[${index}]`] = itemName;
      paymentData[`wsb_invoice_item_quantity[${index}]`] = item.quantity.toString();
      paymentData[`wsb_invoice_item_price[${index}]`] = item.product_price.toFixed(2);
    });

    console.log('=== Final payment data ===');
    console.log(JSON.stringify(paymentData, null, 2));

    return new Response(
      JSON.stringify(paymentData),
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
