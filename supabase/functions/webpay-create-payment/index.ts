import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  console.log('=== STAGE 1: EDGE FUNCTION STARTED ===');
  
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    console.log('CORS preflight request - returning 200');
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('=== STAGE 2: PARSING REQUEST BODY ===');
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

    console.log('Order ID received:', orderId);

    console.log('=== STAGE 3: GETTING ENVIRONMENT VARIABLES ===');
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const wsbStoreId = Deno.env.get('WSB_STOREID') || '554332557';
    const wsbSecretKey = Deno.env.get('WSB_SECRET_KEY')!;

    console.log('Supabase URL:', supabaseUrl);
    console.log('Store ID:', wsbStoreId);
    console.log('Store ID type:', typeof wsbStoreId);
    console.log('Secret key exists:', !!wsbSecretKey);
    console.log('Secret key length:', wsbSecretKey?.length);

    console.log('=== STAGE 4: CREATING SUPABASE CLIENT ===');
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    console.log('Supabase client created');

    console.log('=== STAGE 5: FETCHING ORDER FROM DATABASE ===');
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (orderError) {
      console.log('ERROR fetching order:', JSON.stringify(orderError));
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

    console.log('=== STAGE 6: FETCHING ORDER ITEMS ===');
    const { data: orderItems, error: itemsError } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', orderId);

    if (itemsError) {
      console.log('ERROR fetching order items:', JSON.stringify(itemsError));
      return new Response(
        JSON.stringify({ error: 'Failed to get order items', details: itemsError }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Order items count:', orderItems?.length || 0);
    console.log('Order items:', JSON.stringify(orderItems));

    console.log('=== STAGE 7: PREPARING PAYMENT PARAMETERS ===');
    
    // Generate seed (timestamp as string)
    const seed = Date.now().toString();
    console.log('Generated seed:', seed);

    // Order number (first 8 chars of UUID uppercased)
    const orderNum = `ORDER-${orderId.slice(0, 8).toUpperCase()}`;
    console.log('Order number:', orderNum);

    // Currency and test mode
    const currencyId = 'BYN';
    const testMode = 0; // Production mode

    // Calculate total from order items to ensure it matches
    const itemNames: string[] = [];
    const itemQuantities: number[] = [];
    const itemPrices: number[] = [];
    let calculatedTotal = 0;

    if (orderItems && orderItems.length > 0) {
      for (const item of orderItems) {
        const itemName = item.product_name + 
          (item.size ? ` (${item.size})` : '') + 
          (item.color ? ` - ${item.color}` : '');
        itemNames.push(itemName);
        itemQuantities.push(item.quantity);
        // Ensure price is a number with 2 decimals
        const price = Number(Number(item.product_price).toFixed(2));
        itemPrices.push(price);
        calculatedTotal += item.quantity * price;
      }
    }

    // Round to 2 decimal places
    calculatedTotal = Number(calculatedTotal.toFixed(2));
    
    console.log('Item names:', JSON.stringify(itemNames));
    console.log('Item quantities:', JSON.stringify(itemQuantities));
    console.log('Item prices:', JSON.stringify(itemPrices));
    console.log('Calculated total from items:', calculatedTotal);
    console.log('Order total_price:', order.total_price);

    // Use calculated total to ensure consistency
    const total = calculatedTotal;
    
    // Format total for signature - must match wsb_total format exactly
    const totalStr = total.toFixed(2);
    console.log('Total for signature (string):', totalStr);

    console.log('=== STAGE 8: GENERATING SIGNATURE ===');
    // Generate signature according to WebPay docs:
    // SHA1(wsb_seed + wsb_storeid + wsb_order_num + wsb_test + wsb_currency_id + wsb_total + SecretKey)
    const signatureString = `${seed}${wsbStoreId}${orderNum}${testMode}${currencyId}${totalStr}${wsbSecretKey}`;
    console.log('Signature string:', signatureString);
    
    // Use SHA1 for version 2
    const msgBuffer = new TextEncoder().encode(signatureString);
    const hashBuffer = await crypto.subtle.digest('SHA-1', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const signature = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    console.log('Generated SHA-1 signature:', signature);

    console.log('=== STAGE 9: PREPARING URLs ===');
    const baseUrl = 'https://rumor-chic-style.lovable.app';
    const returnUrl = `${baseUrl}/order-success`;
    const cancelUrl = `${baseUrl}/catalog`;
    const notifyUrl = `${supabaseUrl}/functions/v1/webpay-webhook`;

    console.log('Return URL:', returnUrl);
    console.log('Cancel URL:', cancelUrl);
    console.log('Notify URL:', notifyUrl);

    console.log('=== STAGE 10: BUILDING PAYMENT PAYLOAD ===');
    
    // Clean phone number - only digits
    const cleanPhone = order.customer_phone.replace(/[^0-9]/g, '');
    console.log('Clean phone:', cleanPhone);

    // Build JSON payload - IMPORTANT: wsb_storeid must be a string but wsb_total must be a number
    const paymentPayload = {
      wsb_storeid: wsbStoreId, // String as per docs "number >= 1" but examples show string
      wsb_order_num: orderNum,
      wsb_currency_id: currencyId,
      wsb_version: 2,
      wsb_seed: seed,
      wsb_test: testMode,
      wsb_invoice_item_name: itemNames,
      wsb_invoice_item_quantity: itemQuantities,
      wsb_invoice_item_price: itemPrices,
      wsb_total: total, // Number, not string
      wsb_signature: signature,
      wsb_store: 'RUMOR',
      wsb_language_id: 'russian',
      wsb_return_url: returnUrl,
      wsb_cancel_return_url: cancelUrl,
      wsb_notify_url: notifyUrl,
      wsb_customer_name: order.customer_name || '',
      wsb_customer_address: order.delivery_address || 'Уточняется',
      wsb_email: order.customer_email || '',
      wsb_phone: cleanPhone,
    };

    console.log('=== STAGE 11: PAYMENT PAYLOAD READY ===');
    console.log('Full payload:', JSON.stringify(paymentPayload, null, 2));

    console.log('=== STAGE 12: SENDING REQUEST TO WEBPAY ===');
    const webpayApiUrl = 'https://payment.webpay.by/api/v1/payment';
    console.log('WebPay API URL:', webpayApiUrl);

    const webpayResponse = await fetch(webpayApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentPayload),
    });

    console.log('=== STAGE 13: PROCESSING WEBPAY RESPONSE ===');
    console.log('Response status:', webpayResponse.status);
    console.log('Response ok:', webpayResponse.ok);
    console.log('Response headers:', JSON.stringify(Object.fromEntries(webpayResponse.headers.entries())));

    const webpayResponseText = await webpayResponse.text();
    console.log('Response body (raw):', webpayResponseText);

    if (!webpayResponse.ok) {
      console.log('=== STAGE 13a: WEBPAY RETURNED ERROR ===');
      console.log('Error status:', webpayResponse.status);
      console.log('Error body:', webpayResponseText);
      
      return new Response(
        JSON.stringify({ 
          error: 'WebPay API error', 
          status: webpayResponse.status,
          details: webpayResponseText,
          sentPayload: paymentPayload
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('=== STAGE 14: PARSING WEBPAY RESPONSE ===');
    let webpayData;
    try {
      webpayData = JSON.parse(webpayResponseText);
      console.log('Parsed response:', JSON.stringify(webpayData));
    } catch (e) {
      console.log('ERROR: Failed to parse WebPay response as JSON');
      console.log('Parse error:', e);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to parse WebPay response', 
          details: webpayResponseText 
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('=== STAGE 15: EXTRACTING REDIRECT URL ===');
    const redirectUrl = webpayData?.data?.redirectUrl;
    console.log('Redirect URL from response:', redirectUrl);
    
    if (!redirectUrl) {
      console.log('ERROR: No redirectUrl in WebPay response');
      console.log('Full response data:', JSON.stringify(webpayData));
      return new Response(
        JSON.stringify({ 
          error: 'No redirectUrl in WebPay response', 
          details: webpayData 
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('=== STAGE 16: SUCCESS - RETURNING REDIRECT URL ===');
    console.log('Final redirect URL:', redirectUrl);

    return new Response(
      JSON.stringify({ redirectUrl }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    console.log('=== CATCH BLOCK: UNEXPECTED ERROR ===');
    console.log('Error type:', typeof error);
    console.log('Error:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : 'No stack trace';
    console.log('Error message:', errorMessage);
    console.log('Error stack:', errorStack);
    
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: String(error) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
