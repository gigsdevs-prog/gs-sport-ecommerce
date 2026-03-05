// ============================================
// GS SPORT - Live Chat Widget
// Floating chat bubble with real-time messaging
// Uses Supabase realtime for admin-customer chat
// ============================================

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Minimize2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';

const supabase = createClient();

interface ChatMessage {
  id: string;
  chat_id: string;
  sender_id: string;
  sender_name: string;
  message: string;
  is_admin: boolean;
  created_at: string;
}

export default function LiveChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [chatId, setChatId] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [hasStarted, setHasStarted] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user, profile } = useAuth();

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Load or create chat session
  const startChat = useCallback(async () => {
    try {
      const sessionId = localStorage.getItem('gs_chat_id');

      if (sessionId) {
        setChatId(sessionId);
        setHasStarted(true);

        // Load existing messages
        try {
          const { data, error } = await supabase
            .from('chat_messages')
            .select('*')
            .eq('chat_id', sessionId)
            .order('created_at', { ascending: true });

          if (error) {
            console.error('Chat messages load error:', error);
            // Table might not exist — clear stale session
            localStorage.removeItem('gs_chat_id');
            setChatId(null);
            setHasStarted(false);
            return;
          }
          if (data) setMessages(data);
        } catch {
          localStorage.removeItem('gs_chat_id');
          setChatId(null);
          setHasStarted(false);
        }
        return;
      }

      // Create new chat
      const newChatId = crypto.randomUUID();
      const senderName = user ? (profile?.full_name || 'Customer') : (guestName || 'Guest');

      const { error } = await supabase.from('chat_sessions').insert({
        id: newChatId,
        user_id: user?.id || null,
        guest_name: senderName,
        status: 'active',
      });

      if (error) {
        console.error('Chat session create error:', error);
        toast.error('Chat is temporarily unavailable. Please try again later.');
        return;
      }

      localStorage.setItem('gs_chat_id', newChatId);
      setChatId(newChatId);
      setHasStarted(true);

      // Auto welcome message (ignore errors if table missing)
      try {
        await supabase.from('chat_messages').insert({
          chat_id: newChatId,
          sender_id: 'system',
          sender_name: 'GS SPORT',
          message: 'Welcome to GS SPORT! How can we help you today? 👋',
          is_admin: true,
        });
      } catch {
        // ignore — table might not exist yet
      }

      try {
        const { data } = await supabase
          .from('chat_messages')
          .select('*')
          .eq('chat_id', newChatId)
          .order('created_at', { ascending: true });

        if (data) setMessages(data);
      } catch {
        // ignore — messages will appear via realtime
      }
    } catch (err) {
      console.error('startChat error:', err);
    }
  }, [user, profile, guestName]);

  // Subscribe to realtime messages
  useEffect(() => {
    if (!chatId) return;

    const channel = supabase
      .channel(`chat-${chatId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `chat_id=eq.${chatId}`,
        },
        (payload) => {
          const newMsg = payload.new as ChatMessage;
          setMessages(prev => {
            if (prev.some(m => m.id === newMsg.id)) return prev;
            return [...prev, newMsg];
          });
          if (!isOpen && newMsg.is_admin) {
            setUnreadCount(prev => prev + 1);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [chatId, isOpen]);

  // Reset unread when opening
  useEffect(() => {
    if (isOpen) setUnreadCount(0);
  }, [isOpen]);

  // Check for existing session on mount
  useEffect(() => {
    const sessionId = localStorage.getItem('gs_chat_id');
    if (sessionId) {
      setChatId(sessionId);
      setHasStarted(true);

      (async () => {
        try {
          const { data, error } = await supabase
            .from('chat_messages')
            .select('*')
            .eq('chat_id', sessionId)
            .order('created_at', { ascending: true });

          if (error) {
            console.error('Chat messages load error:', error);
            localStorage.removeItem('gs_chat_id');
            setChatId(null);
            setHasStarted(false);
            return;
          }
          if (data) setMessages(data);
        } catch {
          localStorage.removeItem('gs_chat_id');
          setChatId(null);
          setHasStarted(false);
        }
      })();
    }
  }, []);

  const sendMessage = async () => {
    if (!input.trim() || !chatId || sending) return;
    const msg = input.trim();
    setInput('');
    setSending(true);

    try {
      const senderName = user ? (profile?.full_name || 'Customer') : (guestName || 'Guest');

      const { error } = await supabase.from('chat_messages').insert({
        chat_id: chatId,
        sender_id: user?.id || 'guest',
        sender_name: senderName,
        message: msg,
        is_admin: false,
      });

      if (error) {
        console.error('Send message error:', error);
        setInput(msg); // restore input on failure
      }
    } catch (err) {
      console.error('Send message exception:', err);
      setInput(msg);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const endChat = () => {
    localStorage.removeItem('gs_chat_id');
    setChatId(null);
    setMessages([]);
    setHasStarted(false);
    setIsOpen(false);
    setGuestName('');
  };

  return (
    <>
      {/* Chat Bubble Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-[55] w-14 h-14 bg-black text-white rounded-full shadow-lg flex items-center justify-center hover:bg-neutral-800 transition-colors ${isOpen ? 'hidden' : ''}`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        aria-label="Open live chat"
      >
        <MessageCircle size={24} />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full"
          >
            {unreadCount}
          </motion.span>
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed bottom-6 right-6 z-[55] w-[360px] max-w-[calc(100vw-2rem)] h-[500px] max-h-[calc(100vh-6rem)] bg-white rounded-2xl shadow-2xl border border-neutral-100 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-black text-white px-5 py-4 flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-sm font-semibold tracking-wider">GS SPORT</h3>
                <p className="text-[10px] text-neutral-400 tracking-wider uppercase mt-0.5">
                  Live Chat Support
                </p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 text-neutral-400 hover:text-white transition-colors"
                  aria-label="Minimize"
                >
                  <Minimize2 size={16} />
                </button>
                <button
                  onClick={endChat}
                  className="p-1.5 text-neutral-400 hover:text-white transition-colors"
                  aria-label="Close chat"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Chat Body */}
            {!hasStarted ? (
              /* Start screen */
              <div className="flex-1 flex flex-col items-center justify-center p-6">
                <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
                  <MessageCircle size={28} className="text-neutral-400" />
                </div>
                <h4 className="text-sm font-medium mb-1">Start a conversation</h4>
                <p className="text-xs text-neutral-500 text-center mb-6">
                  Our team typically replies within a few minutes
                </p>

                {!user && (
                  <input
                    type="text"
                    placeholder="Your name"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="w-full px-4 py-2.5 border border-neutral-200 rounded-lg text-sm outline-none focus:border-black transition-colors mb-3"
                  />
                )}

                <button
                  onClick={startChat}
                  disabled={(!user && !guestName.trim())}
                  className="w-full py-3 bg-black text-white text-sm tracking-wider uppercase font-medium rounded-lg hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Start Chat
                </button>
              </div>
            ) : (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className={`flex ${msg.is_admin ? 'justify-start' : 'justify-end'}`}
                    >
                      <div
                        className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                          msg.is_admin
                            ? 'bg-neutral-100 text-neutral-800 rounded-bl-md'
                            : 'bg-black text-white rounded-br-md'
                        }`}
                      >
                        {msg.is_admin && (
                          <span className="block text-[10px] font-medium text-neutral-500 mb-0.5">
                            {msg.sender_name}
                          </span>
                        )}
                        <p className="whitespace-pre-wrap">{msg.message}</p>
                      </div>
                    </motion.div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="border-t border-neutral-100 p-3 shrink-0">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Type a message..."
                      className="flex-1 px-3.5 py-2.5 bg-neutral-50 rounded-full text-sm outline-none focus:bg-neutral-100 transition-colors"
                    />
                    <button
                      onClick={sendMessage}
                      disabled={!input.trim() || sending}
                      className="w-9 h-9 bg-black text-white rounded-full flex items-center justify-center hover:bg-neutral-800 disabled:opacity-40 transition-colors shrink-0"
                      aria-label="Send"
                    >
                      <Send size={14} />
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
