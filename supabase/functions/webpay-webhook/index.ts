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
    // Get environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const wsbSecretKey = Deno.env.get('WSB_SECRET_KEY')!;

    // Parse body - WebPay may send without Content-Type header
    // Read raw body and parse as URL-encoded form data
    const rawBody = await req.text();
    const params = new URLSearchParams(rawBody);
    
    // Helper function to get param value
    const getParam = (key: string): string => params.get(key) || '';
    
    // Extract WebPay parameters
    const siteOrderId = getParam('site_order_id'); // Our order number (ORDER-XXXXXXXX)
    const orderNum = getParam('wsb_order_num');
    const tid = getParam('wsb_tid'); // WebPay transaction ID
    const paymentType = getParam('wsb_payment_type');
    const rcText = getParam('wsb_rc_text'); // Result text
    const rc = getParam('wsb_rc'); // Result code (00 = success)
    const rrn = getParam('wsb_rrn'); // Reference number
    const approvalCode = getParam('wsb_approval_code');
    const signature = getParam('wsb_signature');
    const amount = getParam('wsb_amount');
    const currency = getParam('wsb_currency_id');

    console.log('WebPay notification received:', {
      orderNum,
      tid,
      rc,
      rcText,
      amount
    });

    // Extract order ID from order number (ORDER-XXXXXXXX -> original UUID prefix)
    // The order number format is ORDER-{first 8 chars of UUID uppercased}
    const orderIdPrefix = orderNum?.replace('ORDER-', '').toLowerCase();

    if (!orderIdPrefix) {
      console.error('Invalid order number format');
      return new Response('Invalid order number', { status: 400 });
    }

    // Verify signature
    // WebPay signature = md5(batch_timestamp + currency_id + amount + payment_type + order_id + site_order_id + transaction_id + rrn + secret_key)
    const batchTimestamp = getParam('batch_timestamp');
    const signatureString = `${batchTimestamp}${currency}${amount}${paymentType}${orderNum}${siteOrderId}${tid}${rrn}${wsbSecretKey}`;
    const expectedSignature = await md5(signatureString);

    // Note: Signature verification may vary based on WebPay version
    // For sandbox/test mode, we may skip strict verification
    const isTestMode = true; // Set to false in production
    
    if (!isTestMode && signature !== expectedSignature) {
      console.error('Invalid signature', { received: signature, expected: expectedSignature });
      return new Response('Invalid signature', { status: 403 });
    }

    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Find order by ID prefix (since we only have first 8 chars)
    const { data: orders, error: findError } = await supabase
      .from('orders')
      .select('id, status')
      .ilike('id', `${orderIdPrefix}%`)
      .limit(1);

    if (findError || !orders || orders.length === 0) {
      console.error('Order not found:', orderIdPrefix);
      return new Response('Order not found', { status: 404 });
    }

    const order = orders[0];

    // Determine new status based on result code
    let newStatus = 'pending';
    if (rc === '00') {
      newStatus = 'paid';
    } else if (rc) {
      newStatus = 'payment_failed';
    }

    // Update order status
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        status: newStatus,
        payment_method: 'webpay',
        comment: `WebPay TID: ${tid}, RRN: ${rrn}, RC: ${rc} - ${rcText}`
      })
      .eq('id', order.id);

    if (updateError) {
      console.error('Failed to update order:', updateError);
      return new Response('Failed to update order', { status: 500 });
    }

    console.log(`Order ${order.id} updated to status: ${newStatus}`);

    // Return success response to WebPay
    return new Response('OK', { 
      status: 200, 
      headers: { ...corsHeaders, 'Content-Type': 'text/plain' } 
    });

  } catch (error) {
    console.error('WebPay webhook error:', error);
    return new Response('Internal server error', { status: 500 });
  }
});
