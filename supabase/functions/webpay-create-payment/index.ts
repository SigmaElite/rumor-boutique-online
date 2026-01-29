import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
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
    const wsbStoreId = Deno.env.get('WSB_STOREID') || '554332557';
    const wsbSecretKey = Deno.env.get('WSB_SECRET_KEY')!;

    console.log('Supabase URL:', supabaseUrl);
    console.log('Store ID:', wsbStoreId);
    console.log('Secret key length:', wsbSecretKey?.length);

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

    // Generate seed (timestamp as string)
    const seed = Date.now().toString();
    console.log('Generated seed:', seed);

    // Calculate total - format with 2 decimal places
    const total = order.total_price.toFixed(2);
    console.log('Total price:', total);

    // Order number (first 8 chars of UUID uppercased)
    const orderNum = `ORDER-${orderId.slice(0, 8).toUpperCase()}`;
    console.log('Order number:', orderNum);

    // Currency and test mode
    const currencyId = 'BYN';
    const testMode = 1; // Number for JSON API

    // Generate signature according to WebPay docs:
    // SHA1(wsb_seed + wsb_storeid + wsb_order_num + wsb_test + wsb_currency_id + wsb_total + SecretKey)
    // Fields must be concatenated WITHOUT separators in exact order
    const signatureString = `${seed}${wsbStoreId}${orderNum}${testMode}${currencyId}${total}${wsbSecretKey}`;
    console.log('Signature string:', signatureString);
    
    // Use SHA1 for version 2 (as per official docs)
    const msgBuffer = new TextEncoder().encode(signatureString);
    const hashBuffer = await crypto.subtle.digest('SHA-1', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const signature = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    console.log('Generated SHA-1 signature:', signature);

    // URLs
    const baseUrl = 'https://rumor-chic-style.lovable.app';
    const returnUrl = `${baseUrl}/order-success`;
    const cancelUrl = `${baseUrl}/catalog`;
    const notifyUrl = `${supabaseUrl}/functions/v1/webpay-webhook`;

    console.log('Return URL:', returnUrl);
    console.log('Cancel URL:', cancelUrl);
    console.log('Notify URL:', notifyUrl);

    // Build JSON payload for WebPay API
    const paymentPayload: Record<string, unknown> = {
      wsb_storeid: wsbStoreId,
      wsb_order_num: orderNum,
      wsb_currency_id: currencyId,
      wsb_version: 2,
      wsb_seed: seed,
      wsb_test: testMode,
      wsb_total: parseFloat(total),
      wsb_signature: signature,
      wsb_store: 'RUMOR',
      wsb_language_id: 'russian',
      wsb_return_url: returnUrl,
      wsb_cancel_return_url: cancelUrl,
      wsb_notify_url: notifyUrl,
      wsb_customer_name: order.customer_name,
      wsb_customer_address: order.delivery_address,
      wsb_email: order.customer_email,
      wsb_phone: order.customer_phone.replace(/[^0-9]/g, ''),
      // Invoice items as arrays
      wsb_invoice_item_name: orderItems?.map(item => {
        const itemName = item.product_name + (item.size ? ` (${item.size})` : '') + (item.color ? ` - ${item.color}` : '');
        return itemName;
      }) || [],
      wsb_invoice_item_quantity: orderItems?.map(item => item.quantity) || [],
      wsb_invoice_item_price: orderItems?.map(item => parseFloat(item.product_price.toFixed(2))) || [],
    };

    console.log('=== WebPay API Request Payload ===');
    console.log(JSON.stringify(paymentPayload, null, 2));

    // Make API request to WebPay
    const webpayApiUrl = 'https://securesandbox.webpay.by/api/v1/payment';
    console.log('Sending request to:', webpayApiUrl);

    const webpayResponse = await fetch(webpayApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentPayload),
    });

    const webpayResponseText = await webpayResponse.text();
    console.log('WebPay API Response Status:', webpayResponse.status);
    console.log('WebPay API Response:', webpayResponseText);

    if (!webpayResponse.ok) {
      console.log('ERROR: WebPay API returned error');
      return new Response(
        JSON.stringify({ 
          error: 'WebPay API error', 
          status: webpayResponse.status,
          details: webpayResponseText 
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse WebPay response
    let webpayData;
    try {
      webpayData = JSON.parse(webpayResponseText);
    } catch (e) {
      console.log('ERROR: Failed to parse WebPay response as JSON');
      return new Response(
        JSON.stringify({ 
          error: 'Failed to parse WebPay response', 
          details: webpayResponseText 
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('WebPay parsed response:', JSON.stringify(webpayData));

    // Extract redirectUrl from response
    const redirectUrl = webpayData?.data?.redirectUrl;
    if (!redirectUrl) {
      console.log('ERROR: No redirectUrl in WebPay response');
      return new Response(
        JSON.stringify({ 
          error: 'No redirectUrl in WebPay response', 
          details: webpayData 
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('=== SUCCESS: Got redirectUrl ===');
    console.log('Redirect URL:', redirectUrl);

    return new Response(
      JSON.stringify({ redirectUrl }),
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
