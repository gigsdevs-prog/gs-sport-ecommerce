// ============================================
// GS SPORT - Chat API Routes
// Uses service role to bypass PostgREST schema cache issues
// ============================================

import { NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/supabase/server';

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
        console.error('Chat session create error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
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

      // Insert message first — fastest path for the user
      const { error } = await supabase.from('chat_messages').insert({
        chat_id,
        sender_id: sender_id || 'guest',
        sender_name: sender_name || 'Guest',
        message,
        is_admin: is_admin || false,
      });

      if (error) {
        // If FK constraint fails, session was deleted
        if (error.code === '23503') {
          return NextResponse.json({ error: 'session_deleted' }, { status: 404 });
        }
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      // Update session timestamp and unread count — fire-and-forget, don't block the response
      if (is_admin) {
        supabase
          .from('chat_sessions')
          .update({ updated_at: new Date().toISOString(), unread_count: 0 })
          .eq('id', chat_id)
          .then(() => {});
      } else {
        supabase
          .from('chat_sessions')
          .select('unread_count')
          .eq('id', chat_id)
          .single()
          .then(({ data: s }) => {
            supabase
              .from('chat_sessions')
              .update({ updated_at: new Date().toISOString(), unread_count: (s?.unread_count || 0) + 1 })
              .eq('id', chat_id)
              .then(() => {});
          });
      }

      return NextResponse.json({ success: true });
    }

    // Mark as read (reset unread_count)
    if (action === 'mark_read') {
      const { chat_id } = body;
      if (!chat_id) {
        return NextResponse.json({ error: 'Missing chat_id' }, { status: 400 });
      }
      await supabase
        .from('chat_sessions')
        .update({ unread_count: 0 })
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

    // Verify session exists
    const { data: session } = await supabase
      .from('chat_sessions')
      .select('id')
      .eq('id', chatId)
      .single();

    if (!session) {
      return NextResponse.json({ error: 'session_deleted', messages: [] }, { status: 404 });
    }

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
