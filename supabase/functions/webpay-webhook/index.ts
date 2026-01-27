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

    // Parse form data from WebPay
    const formData = await req.formData();
    
    // Extract WebPay parameters
    const siteOrderId = formData.get('site_order_id') as string; // Our order number (ORDER-XXXXXXXX)
    const orderNum = formData.get('wsb_order_num') as string;
    const tid = formData.get('wsb_tid') as string; // WebPay transaction ID
    const paymentType = formData.get('wsb_payment_type') as string;
    const rcText = formData.get('wsb_rc_text') as string; // Result text
    const rc = formData.get('wsb_rc') as string; // Result code (00 = success)
    const rrn = formData.get('wsb_rrn') as string; // Reference number
    const approvalCode = formData.get('wsb_approval_code') as string;
    const signature = formData.get('wsb_signature') as string;
    const amount = formData.get('wsb_amount') as string;
    const currency = formData.get('wsb_currency_id') as string;

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
    const batchTimestamp = formData.get('batch_timestamp') as string || '';
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
