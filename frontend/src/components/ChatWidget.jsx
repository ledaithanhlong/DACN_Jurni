import React, { useEffect, useRef, useState } from 'react';
import { SignedIn, SignedOut, useUser } from '@clerk/clerk-react';
import { io } from 'socket.io-client';
import axios from 'axios';

// Socket URL should be the root domain, not including /api
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const SOCKET_URL = API_URL.replace(/\/api$/, '');

const initialMessages = [
  {
    id: 'welcome',
    role: 'staff', // Uniform role naming
    text: 'Xin chào! Jurni có thể hỗ trợ gì cho bạn hôm nay?',
    timestamp: new Date().toISOString(),
  },
];

export default function ChatWidget() {
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);

  // Create a stable room ID
  const roomId = user?.id || sessionStorage.getItem('guest_chat_id') || `guest-${Date.now()}`;
  if (!user && !sessionStorage.getItem('guest_chat_id')) {
    sessionStorage.setItem('guest_chat_id', roomId);
  }

  // Fetch history on mount
  useEffect(() => {
    if (!roomId) return;
    const fetchHistory = async () => {
      try {
        const res = await axios.get(`${API_URL}/messages/${roomId}`);
        if (res.data.length > 0) {
          setMessages(res.data.map(m => ({
            id: m.id,
            text: m.text,
            role: m.role,
            timestamp: m.timestamp
          })));
        }
      } catch (e) {
        console.error('Failed to fetch chat history', e);
      }
    };
    fetchHistory();
  }, [roomId]);

  useEffect(() => {
    // Connect to Socket.IO
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    // Join room
    newSocket.emit('join_room', roomId);

    // Listen for incoming messages
    newSocket.on('receive_message', (data) => {
      // Don't duplicate if we just sent it (though usually good to confirm via server echo, simple push here works too)
      // For this simple implementation, we'll append everything we receive, assuming sender logic handles optimistic UI or we filter self.
      setMessages((prev) => {
        // Avoid duplicate logic if needed, but for now simple append
        // If we want to avoid double-showing our own message if we add it optimistically:
        if (prev.some(m => m.timestamp === data.timestamp && m.text === data.content)) return prev;

        return [...prev, {
          id: Date.now() + Math.random(),
          role: data.role,
          text: data.content,
          timestamp: data.timestamp
        }];
      });
    });

    return () => newSocket.disconnect();
  }, [roomId]);

  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, messages]);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!input.trim() || !socket) return;

    const messageData = {
      roomId: roomId,
      sender: user?.firstName || 'Guest',
      role: 'customer',
      content: input.trim(),
      timestamp: new Date().toISOString()
    };

    // Optimistic UI update
    setMessages((prev) => [...prev, {
      id: `temp-${Date.now()}`,
      role: 'customer',
      text: input.trim(),
      timestamp: messageData.timestamp
    }]);

    socket.emit('send_message', messageData);
    setInput('');

    // Simulate automated response only if it's the first user message (optional, requested behavior was:
    // "sau khi chatbox thông báo liên hệ với nhân viên thì trong mục hộp thoại của nhân viên sẽ hiện lên"
    // So we can send the automated message LOCALLY immediately, and the staff notification happens on server.

    // We'll mimic the prompt's request: "Wait a moment... notification sent...". 
    // Actually, let's keep it simple: Real staff chat implies we just wait for staff.
    // If we want the automated "Connecting you..." message:
    if (messages.length === 1) { // Only welcome message was there
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: 'auto-reply',
          role: 'staff',
          text: 'Cảm ơn bạn đã liên hệ! Đội ngũ chăm sóc khách hàng sẽ phản hồi trong ít phút. Bạn cũng có thể gọi hotline 1900 6868 để được ưu tiên.',
          timestamp: new Date().toISOString()
        }]);
      }, 500);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
      {isOpen && (
        <div className="w-80 max-w-[90vw] overflow-hidden rounded-3xl border border-blue-200 bg-white/95 shadow-2xl backdrop-blur">
          <header className="bg-gradient-to-r from-blue-700 via-blue-600 to-sky-500 px-5 py-4 text-white">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold">Jurni Care</p>
                <SignedIn>
                  <p className="text-xs text-white/80">
                    Xin chào, {user?.firstName || user?.username || 'bạn'} 👋
                  </p>
                </SignedIn>
                <SignedOut>
                  <p className="text-xs text-white/80">Khách vãng lai (Guest)</p>
                </SignedOut>
              </div>
              <button
                type="button"
                onClick={handleToggle}
                className="rounded-full bg-white/20 px-2 py-1 text-xs font-semibold text-white hover:bg-white/30 transition"
              >
                Thu nhỏ
              </button>
            </div>
          </header>
          <div className="max-h-80 overflow-y-auto bg-blue-50/60 px-4 py-4 space-y-3 text-sm text-blue-900">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'customer' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl px-3 py-2 shadow-sm ${message.role === 'customer'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-blue-900 border border-blue-100'
                    }`}
                >
                  <p>{message.text}</p>
                  <span className="mt-1 block text-[10px] opacity-70">
                    {new Date(message.timestamp).toLocaleTimeString('vi-VN', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={handleSubmit} className="border-t border-blue-100 bg-white/90 px-4 py-3">
            <label className="sr-only" htmlFor="chat-message">
              Tin nhắn hỗ trợ
            </label>
            <textarea
              id="chat-message"
              rows={2}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Nhập câu hỏi của bạn..."
              className="w-full resize-none rounded-xl border border-blue-100 px-3 py-2 text-sm text-blue-900 placeholder-blue-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
            <div className="mt-2 flex items-center justify-between text-xs text-blue-500">
              <span>Phản hồi trung bình: &lt; 5 phút</span>
              <button
                type="submit"
                className="rounded-full bg-blue-600 px-4 py-1 text-xs font-semibold text-white hover:bg-blue-700 transition disabled:opacity-60"
                disabled={!input.trim()}
              >
                Gửi
              </button>
            </div>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={handleToggle}
        className="flex items-center gap-3 rounded-full border border-blue-200 bg-white px-4 py-2 text-sm font-semibold text-blue-700 shadow-lg shadow-blue-100/70 transition hover:-translate-y-0.5 hover:shadow-xl"
        aria-expanded={isOpen}
        aria-controls="jurni-chat-widget"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white text-lg">
          💬
        </span>
        <span>{isOpen ? 'Thu nhỏ' : 'Hỗ trợ trực tuyến'}</span>
      </button>
    </div>
  );
}








