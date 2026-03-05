// ============================================
// GS SPORT - Chat API Routes
// Uses service role to bypass PostgREST schema cache issues
// ============================================

import { NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/supabase/server';

// Ensure chat tables exist
async function ensureChatTables(supabase: ReturnType<typeof createAdminSupabaseClient>) {
  // Check if chat_sessions table exists
  const { data: tables } = await supabase.rpc('to_regclass', { name: 'public.chat_sessions' }).maybeSingle();
  
  // If tables don't exist, they need to be created via SQL
  // We use raw SQL via supabase-js
  const { error: checkError } = await supabase
    .from('chat_sessions')
    .select('id')
    .limit(0);

  if (checkError?.code === 'PGRST204' || checkError?.message?.includes('schema cache') || checkError?.code === '42P01') {
    // Tables don't exist or not in schema cache - create them
    const createSQL = `
      CREATE TABLE IF NOT EXISTS public.chat_sessions (
        id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
        user_id text,
        guest_name text NOT NULL DEFAULT 'Guest',
        status text NOT NULL DEFAULT 'active',
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      );

      CREATE TABLE IF NOT EXISTS public.chat_messages (
        id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
        chat_id text NOT NULL REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
        sender_id text NOT NULL,
        sender_name text NOT NULL,
        message text NOT NULL,
        is_admin boolean NOT NULL DEFAULT false,
        created_at timestamptz NOT NULL DEFAULT now()
      );

      ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
      ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'chat_sessions' AND policyname = 'Allow all on chat_sessions') THEN
          CREATE POLICY "Allow all on chat_sessions" ON public.chat_sessions FOR ALL USING (true) WITH CHECK (true);
        END IF;
      END $$;

      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'chat_messages' AND policyname = 'Allow all on chat_messages') THEN
          CREATE POLICY "Allow all on chat_messages" ON public.chat_messages FOR ALL USING (true) WITH CHECK (true);
        END IF;
      END $$;

      GRANT USAGE ON SCHEMA public TO anon, authenticated;
      GRANT ALL ON public.chat_sessions TO anon, authenticated;
      GRANT ALL ON public.chat_messages TO anon, authenticated;

      NOTIFY pgrst, 'reload schema';
    `;

    // Execute via Supabase Management API (SQL endpoint)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    
    const sqlRes = await fetch(`${supabaseUrl}/rest/v1/rpc/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': serviceKey,
        'Authorization': `Bearer ${serviceKey}`,
      },
      body: JSON.stringify({ query: createSQL }),
    });

    // Alternative: try direct pg endpoint
    if (!sqlRes.ok) {
      // Tables need to be created manually via Supabase SQL Editor
      console.error('Could not auto-create chat tables. Please create them via Supabase SQL Editor.');
    }
  }
}

// POST - Create session or send message
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action } = body;
    const supabase = createAdminSupabaseClient();

    if (action === 'create_session') {
      const { id, user_id, guest_name } = body;
      if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

      const { error } = await supabase.from('chat_sessions').insert({
        id,
        user_id: user_id || null,
        guest_name: guest_name || 'Guest',
        status: 'active',
      });

      if (error) {
        // If table not found, try to create it
        if (error.message?.includes('schema cache') || error.code === '42P01') {
          await ensureChatTables(supabase);
          // Retry
          const { error: retryError } = await supabase.from('chat_sessions').insert({
            id,
            user_id: user_id || null,
            guest_name: guest_name || 'Guest',
            status: 'active',
          });
          if (retryError) {
            return NextResponse.json({ error: retryError.message }, { status: 500 });
          }
        } else {
          return NextResponse.json({ error: error.message }, { status: 500 });
        }
      }

      // Auto welcome message
      await supabase.from('chat_messages').insert({
        chat_id: id,
        sender_id: 'system',
        sender_name: 'GS SPORT',
        message: 'Welcome to GS SPORT! How can we help you today? 👋',
        is_admin: true,
      });

      // Fetch messages
      const { data: messages } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('chat_id', id)
        .order('created_at', { ascending: true });

      return NextResponse.json({ success: true, messages: messages || [] });
    }

    if (action === 'send_message') {
      const { chat_id, sender_id, sender_name, message, is_admin } = body;
      if (!chat_id || !message) {
        return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
      }

      const { error } = await supabase.from('chat_messages').insert({
        chat_id,
        sender_id: sender_id || 'guest',
        sender_name: sender_name || 'Guest',
        message,
        is_admin: is_admin || false,
      });

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      // Update session timestamp
      await supabase
        .from('chat_sessions')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', chat_id);

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (err) {
    console.error('Chat API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET - Fetch messages for a chat session
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const chatId = url.searchParams.get('chat_id');
    if (!chatId) {
      return NextResponse.json({ error: 'Missing chat_id' }, { status: 400 });
    }

    const supabase = createAdminSupabaseClient();
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ messages: data || [] });
  } catch (err) {
    console.error('Chat GET error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
