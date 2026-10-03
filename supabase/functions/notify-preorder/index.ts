import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const sanitizeString = (input: unknown, maxLength = 500): string => {
  if (typeof input !== 'string') return '';
  return input.trim().slice(0, maxLength);
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();

    const productName = sanitizeString(body.product_name, 200);
    const customerName = sanitizeString(body.customer_name, 100);
    const phone = sanitizeString(body.phone, 30);
    const size = sanitizeString(body.size, 20);
    const color = sanitizeString(body.color, 50);
    const comment = sanitizeString(body.comment, 500);

    if (!customerName || !phone || !productName) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const botToken = Deno.env.get('TELEGRAM_BOT_TOKEN');
    const chatId = Deno.env.get('TELEGRAM_CHAT_ID');

    if (!botToken || !chatId) {
      return new Response(
        JSON.stringify({ error: 'Telegram not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const message = `📋 <b>Новый предзаказ!</b>\n\n` +
      `<b>Товар:</b> ${productName}\n` +
      (color ? `<b>Цвет:</b> ${color}\n` : '') +
      (size ? `<b>Нужный размер:</b> ${size}\n` : '') +
      `\n<b>Клиент:</b> ${customerName}\n` +
      `<b>Телефон:</b> ${phone}\n` +
      (comment ? `<b>Комментарий:</b> ${comment}\n` : '');

    const tgResponse = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
      }),
    });

    if (!tgResponse.ok) {
      const errorBody = await tgResponse.text();
      console.error(`Telegram API error [${tgResponse.status}]: ${errorBody}`);
      return new Response(
        JSON.stringify({ error: 'Telegram send failed', status: tgResponse.status }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ ok: true }),
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
