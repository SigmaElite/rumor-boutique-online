import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    const { secret_key } = await req.json();
    
    // Get secret key from environment variables
    const expectedSecretKey = Deno.env.get('ADMIN_SECRET_KEY');
    
    if (!expectedSecretKey) {
      console.error('ADMIN_SECRET_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Security check - only allow with correct secret from environment
    if (secret_key !== expectedSecretKey) {
      console.warn('Unauthorized admin creation attempt');
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get admin credentials from environment variables
    const adminEmail = Deno.env.get('ADMIN_EMAIL');
    const adminPassword = Deno.env.get('ADMIN_PASSWORD');

    if (!adminEmail || !adminPassword) {
      console.error('Admin credentials not configured in environment');
      return new Response(
        JSON.stringify({ error: 'Admin credentials not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if admin already exists
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const adminExists = existingUsers?.users?.some(u => u.email === adminEmail);

    if (adminExists) {
      console.log('Admin user already exists');
      return new Response(
        JSON.stringify({ message: 'Admin already exists' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create admin user
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
    });

    if (userError) {
      console.error('Error creating admin user:', userError);
      throw userError;
    }

    console.log('Admin user created successfully');

    // Update user role to admin
    if (userData.user) {
      const { error: roleError } = await supabaseAdmin
        .from('user_roles')
        .update({ role: 'admin' })
        .eq('user_id', userData.user.id);

      if (roleError) {
        console.error('Error updating role:', roleError);
        // Try inserting if update failed (in case trigger didn't fire)
        await supabaseAdmin
          .from('user_roles')
          .insert({ user_id: userData.user.id, role: 'admin' });
      }

      console.log('Admin role assigned');
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Admin created successfully'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
