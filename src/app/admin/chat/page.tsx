// ============================================
// GS SPORT - Admin: Live Chat Manager
// View and respond to customer chat sessions
// ============================================

'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Send, User, Clock, CheckCircle, XCircle, Trash2 } from 'lucide-react';
// ...existing code...
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';

const supabase = createClient();

interface ChatSession {
  id: string;
  user_id: string | null;
  guest_name: string;
  status: string;
  created_at: string;
  updated_at: string;
  last_message?: string;
  unread_count?: number;
}

interface ChatMessage {
  id: string;
  chat_id: string;
  sender_id: string;
  sender_name: string;
  message: string;
  is_admin: boolean;
  created_at: string;
}

export default function AdminChatPage() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // ...existing code...
  // Delete a chat session and its messages
  const deleteSession = async (chatId: string) => {
    if (!window.confirm('Are you sure you want to delete this chat and all its messages?')) return;
    try {
      const { error } = await supabase
        .from('chat_sessions')
        .delete()
        .eq('id', chatId);
      if (error) {
        console.error('Delete session error:', error);
        toast.error('Failed to delete chat');
        return;
      }
      toast.success('Chat deleted');
      if (selectedChat === chatId) {
        setSelectedChat(null);
        setMessages([]);
      }
      fetchSessions();
    } catch (err) {
      console.error('Delete session exception:', err);
      toast.error('Failed to delete chat');
    }
  };

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, scrollToBottom]);

  // Fetch all chat sessions
  const fetchSessions = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) {
        // Table may not exist — silently handle
        console.error('Fetch sessions error:', error);
        setSessions([]);
        return;
      }

      setSessions(data || []);
    } catch (err) {
      console.error('Sessions fetch error:', err);
      setSessions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchSessions(); }, [fetchSessions]);

  // Subscribe to new sessions
  useEffect(() => {
    const channel = supabase
      .channel('admin-chat-sessions')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'chat_sessions' },
        () => { fetchSessions(); }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [fetchSessions]);

  // Load messages for selected chat
  const loadMessages = useCallback(async (chatId: string) => {
    setSelectedChat(chatId);
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Load messages error:', error);
        setMessages([]);
        return;
      }
      setMessages(data || []);
    } catch (err) {
      console.error('Load messages exception:', err);
      setMessages([]);
    }
  }, []);

  // Subscribe to new messages in selected chat
  useEffect(() => {
    if (!selectedChat) return;

    const channel = supabase
      .channel(`admin-chat-msg-${selectedChat}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `chat_id=eq.${selectedChat}`,
        },
        (payload) => {
          const newMsg = payload.new as ChatMessage;
          setMessages(prev => {
            if (prev.some(m => m.id === newMsg.id)) return prev;
            return [...prev, newMsg];
          });
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [selectedChat]);

  const sendMessage = async () => {
    if (!input.trim() || !selectedChat || sending) return;
    const msg = input.trim();
    setInput('');
    setSending(true);

    try {
      const { error } = await supabase.from('chat_messages').insert({
        chat_id: selectedChat,
        sender_id: 'admin',
        sender_name: 'GS SPORT Team',
        message: msg,
        is_admin: true,
      });

      if (error) {
        toast.error('Failed to send');
        setInput(msg);
      }

      // Update session timestamp (ignore errors)
      try {
        await supabase
          .from('chat_sessions')
          .update({ updated_at: new Date().toISOString() })
          .eq('id', selectedChat);
      } catch {
        // ignore timestamp update failure
      }
    } catch (err) {
      console.error('Send message error:', err);
      toast.error('Failed to send');
      setInput(msg);
    } finally {
      setSending(false);
    }
  };

  const closeSession = async (chatId: string) => {
    try {
      const { error } = await supabase
        .from('chat_sessions')
        .update({ status: 'closed' })
        .eq('id', chatId);
      if (error) {
        console.error('Close session error:', error);
        toast.error('Failed to close chat');
        return;
      }
      toast.success('Chat closed');
      fetchSessions();
    } catch (err) {
      console.error('Close session exception:', err);
      toast.error('Failed to close chat');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return d.toLocaleDateString();
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-light tracking-wide">Live Chat</h1>
        <p className="text-sm text-neutral-500 mt-1">
          Respond to customer messages in real-time
        </p>
      </div>

      <div className="bg-white rounded-xl border border-neutral-100 overflow-hidden flex" style={{ height: 'calc(100vh - 250px)', minHeight: '500px' }}>
        {/* Sessions list */}
        <div className="w-80 border-r border-neutral-100 flex flex-col shrink-0">
          <div className="px-4 py-3 border-b border-neutral-100">
            <h3 className="text-xs tracking-widest uppercase text-neutral-500 font-medium">
              Conversations ({sessions.filter(s => s.status === 'active').length} active)
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-sm text-neutral-400">Loading...</div>
            ) : sessions.length === 0 ? (
              <div className="p-8 text-center">
                <MessageCircle size={32} className="mx-auto text-neutral-200 mb-2" />
                <p className="text-sm text-neutral-400">No chats yet</p>
              </div>
            ) : (
              sessions.map(session => (
                <div key={session.id} className={`group flex items-center justify-between px-4 py-3 border-b border-neutral-50 hover:bg-neutral-50 transition-colors ${selectedChat === session.id ? 'bg-neutral-50' : ''}`}>
                  <button
                    onClick={async () => {
                      await fetch('/api/chat', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ action: 'mark_read', chat_id: session.id }),
                      });
                      loadMessages(session.id);
                    }}
                    className="flex-1 text-left focus:outline-none relative"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${session.status === 'active' ? 'bg-green-400' : 'bg-neutral-300'}`} />
                        <span className="text-sm font-medium truncate max-w-[120px]">
                          {session.guest_name || 'Customer'}
                        </span>
                        {session.unread_count && session.unread_count > 0 && (
                          <span className="ml-2 w-2.5 h-2.5 bg-blue-500 rounded-full inline-block" title="Unread messages" />
                        )}
                      </div>
                      <span className="text-[10px] text-neutral-400">
                        {formatTime(session.updated_at)}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400 truncate">
                      {session.status === 'active' ? 'Active' : 'Closed'}
                    </p>
                  </button>
                  <button
                    onClick={() => deleteSession(session.id)}
                    className="ml-2 p-1.5 text-neutral-300 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Delete chat"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col">
          {selectedChat ? (
            <>
              {/* Chat header */}
              <div className="px-5 py-3 border-b border-neutral-100 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-neutral-100 rounded-full flex items-center justify-center">
                    <User size={14} className="text-neutral-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {sessions.find(s => s.id === selectedChat)?.guest_name || 'Customer'}
                    </p>
                    <p className="text-[10px] text-neutral-400">
                      {sessions.find(s => s.id === selectedChat)?.status === 'active' ? (
                        <span className="flex items-center gap-1"><CheckCircle size={10} className="text-green-500" /> Active</span>
                      ) : (
                        <span className="flex items-center gap-1"><Clock size={10} /> Closed</span>
                      )}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => closeSession(selectedChat)}
                  className="text-xs px-3 py-1.5 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors flex items-center gap-1.5"
                >
                  <XCircle size={12} />
                  Close Chat
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-5 space-y-3">
                {messages.map(msg => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.is_admin ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[65%] px-4 py-2.5 rounded-2xl text-sm ${
                        msg.is_admin
                          ? 'bg-black text-white rounded-br-md'
                          : 'bg-neutral-100 text-neutral-800 rounded-bl-md'
                      }`}
                    >
                      <span className={`block text-[10px] font-medium mb-0.5 ${msg.is_admin ? 'text-neutral-400' : 'text-neutral-500'}`}>
                        {msg.sender_name}
                      </span>
                      <p className="whitespace-pre-wrap">{msg.message}</p>
                      <span className={`block text-[9px] mt-1 ${msg.is_admin ? 'text-neutral-500' : 'text-neutral-400'}`}>
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </motion.div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              {sessions.find(s => s.id === selectedChat)?.status === 'active' && (
                <div className="border-t border-neutral-100 p-4 shrink-0">
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Type your reply..."
                      className="flex-1 px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-sm outline-none focus:border-black transition-colors"
                    />
                    <button
                      onClick={sendMessage}
                      disabled={!input.trim() || sending}
                      className="px-5 py-2.5 bg-black text-white rounded-lg text-sm flex items-center gap-2 hover:bg-neutral-800 disabled:opacity-40 transition-colors"
                    >
                      <Send size={14} />
                      Send
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-neutral-400">
              <MessageCircle size={48} className="mb-3 text-neutral-200" />
              <p className="text-sm">Select a conversation to start replying</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
