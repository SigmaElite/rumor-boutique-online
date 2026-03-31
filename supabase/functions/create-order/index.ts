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
  customer_instagram?: string;
  delivery_address?: string;
  delivery_method?: string;
  payment_method?: string;
  comment?: string;
  items: OrderItem[];
}

const sanitizeString = (input: string, maxLength: number = 500): string => {
  if (typeof input !== 'string') return '';
  return input.trim().slice(0, maxLength);
};

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 255;
};

const validatePhone = (phone: string): boolean => {
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
  return /^\+?[0-9]{9,15}$/.test(cleanPhone);
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body: OrderRequest = await req.json();
    
    const customerName = sanitizeString(body.customer_name, 100);
    const customerEmail = sanitizeString(body.customer_email, 255);
    const customerPhone = sanitizeString(body.customer_phone, 20);
    const customerInstagram = body.customer_instagram ? sanitizeString(body.customer_instagram, 100) : null;
    const deliveryAddress = sanitizeString(body.delivery_address || 'Уточняется', 500);
    const deliveryMethod = sanitizeString(body.delivery_method || 'Самовывоз', 100);
    const paymentMethod = sanitizeString(body.payment_method || 'cash', 50);
    const comment = sanitizeString(body.comment || '', 1000);
    const items = body.items;

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

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch actual product prices from database
    const productIds = items.map(item => item.product_id).filter(id => id);
    
    let productPrices: Record<string, number> = {};
    if (productIds.length > 0) {
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('id, price, name')
        .in('id', productIds);

      if (productsError) {
        return new Response(
          JSON.stringify({ error: 'Failed to validate products' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      productPrices = (products || []).reduce((acc, p) => {
        acc[p.id] = Number(p.price);
        return acc;
      }, {} as Record<string, number>);
    }

    let totalPrice = 0;
    const validatedItems: OrderItem[] = [];

    for (const item of items) {
      const actualPrice = productPrices[item.product_id];
      
      if (actualPrice === undefined) {
        return new Response(
          JSON.stringify({ error: `Product not found: ${item.product_name}` }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const quantity = Math.max(1, Math.min(100, Math.floor(Number(item.quantity) || 1)));
      
      validatedItems.push({
        product_id: item.product_id,
        product_name: sanitizeString(item.product_name, 200),
        product_price: actualPrice,
        quantity: quantity,
        size: item.size ? sanitizeString(item.size, 20) : undefined,
        color: item.color ? sanitizeString(item.color, 50) : undefined,
      });

      totalPrice += actualPrice * quantity;
    }

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: null,
        total_price: totalPrice,
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        customer_instagram: customerInstagram,
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
      await supabase.from('orders').delete().eq('id', order.id);
      return new Response(
        JSON.stringify({ error: 'Failed to create order items' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Send Telegram notification
    try {
      const botToken = Deno.env.get('TELEGRAM_BOT_TOKEN');
      const chatId = Deno.env.get('TELEGRAM_CHAT_ID');

      if (botToken && chatId) {
        const itemsList = validatedItems
          .map(i => `  • ${i.product_name}${i.size ? ` (${i.size})` : ''}${i.color ? ` — ${i.color}` : ''} × ${i.quantity} — ${i.product_price} BYN`)
          .join('\n');

        const message = `🛒 <b>Новый заказ!</b>\n\n` +
          `<b>Клиент:</b> ${customerName}\n` +
          `<b>Телефон:</b> ${customerPhone}\n` +
          `<b>Email:</b> ${customerEmail}\n` +
          (customerInstagram ? `<b>Instagram:</b> ${customerInstagram}\n` : '') +
          `\n<b>Доставка:</b> ${deliveryMethod}\n` +
          `<b>Адрес:</b> ${deliveryAddress}\n` +
          (comment ? `<b>Комментарий:</b> ${comment}\n` : '') +
          `\n<b>Товары:</b>\n${itemsList}\n` +
          `\n<b>Итого: ${totalPrice} BYN</b>`;

        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: message,
            parse_mode: 'HTML',
          }),
        });
      }
    } catch (tgError) {
      console.error('Telegram notification error:', tgError);
    }

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