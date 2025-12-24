import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useUser, RedirectToSignIn } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Initialize socket outside component to prevent multiple connections
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const SOCKET_URL = API_URL.replace(/\/api$/, '');

export default function StaffPage() {
    const { user, isSignedIn, isLoaded } = useUser();
    const navigate = useNavigate();
    const [socket, setSocket] = useState(null);
    const [activeConversations, setActiveConversations] = useState([]); // { roomId, sender, lastMessage, timestamp, unread }
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        // Fetch active conversations list (Snapshot)
        const fetchConversations = async () => {
            try {
                const res = await axios.get(`${API_URL}/messages/conversations`);
                setActiveConversations(res.data);
            } catch (e) {
                console.error('Failed to fetch active conversations', e);
            }
        };

        fetchConversations();

        const newSocket = io(SOCKET_URL);
        setSocket(newSocket);

        // Listen for new conversations/messages from customers
        newSocket.on('staff_notification', (data) => {
            // data: { roomId, sender, content, timestamp }
            setActiveConversations((prev) => {
                const existingDetails = prev.find(c => c.roomId === data.roomId);
                const others = prev.filter(c => c.roomId !== data.roomId);

                const updatedDetails = {
                    roomId: data.roomId,
                    // If we already have sender info (e.g. from API), preserve it, else use socket data
                    senderName: existingDetails?.senderName || data.sender,
                    lastMessage: data.content,
                    timestamp: data.timestamp,
                    unread: (existingDetails?.unread || 0) + 1,
                    avatar: existingDetails?.avatar
                };

                return [updatedDetails, ...others];
            });
        });

        // Listen for messages in the active room
        newSocket.on('receive_message', (data) => {
            setMessages((prev) => [...prev, data]);
        });

        return () => newSocket.disconnect();
    }, []);

    // Auto-scroll to bottom
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const handleSelectRoom = async (room) => {
        setSelectedRoom(room);
        setMessages([]);

        // Fetch history
        try {
            const res = await axios.get(`${API_URL}/messages/${room.roomId}`);
            setMessages(res.data.map(m => ({
                content: m.text,
                role: m.role,
                timestamp: m.timestamp,
                sender: m.sender // optional
            })));
        } catch (e) {
            console.error('Failed to fetch history', e);
        }

        // Join the socket room
        if (socket) {
            socket.emit('join_room', room.roomId);
        }

        // Mark as read in UI
        setActiveConversations(prev =>
            prev.map(c => c.roomId === room.roomId ? { ...c, unread: 0 } : c)
        );
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!input.trim() || !selectedRoom || !socket) return;

        const messageData = {
            roomId: selectedRoom.roomId,
            sender: user?.firstName || 'Support Staff',
            role: 'staff',
            content: input,
            timestamp: new Date().toISOString()
        };

        socket.emit('send_message', messageData);
        setInput('');
    };

    if (!isLoaded) return <div>Loading...</div>;

    if (!isSignedIn) {
        return <RedirectToSignIn />;
    }

    // Basic layout: "Trắng trơn" (Plain white) with Navbar
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Navbar */}
            <nav className="bg-white shadow-sm border-b px-6 py-4 flex justify-between items-center sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    <h1 className="text-xl font-bold text-blue-900">Jurni Staff Portal</h1>
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                        CS Team
                    </span>
                </div>
                <div className="relative">
                    <span className="text-2xl">💬</span>
                    {activeConversations.reduce((acc, curr) => acc + curr.unread, 0) > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                            {activeConversations.reduce((acc, curr) => acc + curr.unread, 0)}
                        </span>
                    )}
                </div>
            </nav>

            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar: Conversation List */}
                <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
                    <div className="p-4 font-bold text-gray-700 border-b">Hội thoại</div>
                    {activeConversations.length === 0 ? (
                        <div className="p-4 text-gray-500 text-sm text-center">Chưa có tin nhắn nào</div>
                    ) : (
                        <ul>
                            {activeConversations.map((conv) => (
                                <li
                                    key={conv.roomId}
                                    onClick={() => handleSelectRoom(conv)}
                                    className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition ${selectedRoom?.roomId === conv.roomId ? 'bg-blue-50 border-l-4 border-blue-500' : ''}`}
                                >
                                    <div className="flex items-center gap-3 mb-2">
                                        {/* Avatar */}
                                        <div className="flex-shrink-0 h-10 w-10 text-white flex items-center justify-center rounded-full bg-blue-200">
                                            {/* Simple Initials or Icon */}
                                            <span className="text-sm font-bold text-blue-700">
                                                {conv.senderName ? conv.senderName.charAt(0).toUpperCase() : 'U'}
                                            </span>
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-baseline">
                                                <span className="font-semibold text-gray-900 truncate">
                                                    {conv.senderName || conv.sender || `User ${conv.roomId}`}
                                                </span>
                                                <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                                                    {new Date(conv.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                            <div className="text-sm text-gray-600 truncate mt-0.5">
                                                {conv.lastMessage}
                                            </div>
                                        </div>
                                    </div>

                                    {conv.unread > 0 && (
                                        <div className="ml-14 flex justify-end">
                                            <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                                {conv.unread} tin nhắn mới
                                            </span>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Chat Area */}
                <div className="flex-1 flex flex-col bg-white">
                    {selectedRoom ? (
                        <>
                            {/* Chat Header */}
                            {/* Chat Header */}
                            <div className="p-4 border-b bg-gray-50 flex items-center gap-3">
                                <div className="h-10 w-10 text-white flex items-center justify-center rounded-full bg-blue-600 shadow-md">
                                    <span className="text-base font-bold">
                                        {(selectedRoom.senderName || selectedRoom.sender || 'U').charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div>
                                    <h2 className="font-bold text-lg text-gray-800">
                                        {selectedRoom.senderName || selectedRoom.sender}
                                    </h2>
                                    <p className="text-xs text-gray-500 flex items-center gap-1">
                                        <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span>
                                        ID: {selectedRoom.roomId}
                                    </p>
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)).map((msg, idx) => (
                                    <div
                                        key={idx}
                                        className={`flex ${msg.role === 'staff' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`max-w-[70%] rounded-2xl px-4 py-3 ${msg.role === 'staff'
                                            ? 'bg-blue-600 text-white rounded-br-none'
                                            : 'bg-gray-100 text-gray-800 rounded-bl-none'
                                            }`}>
                                            <p>{msg.content}</p>
                                            <p className={`text-[10px] mt-1 text-right ${msg.role === 'staff' ? 'text-blue-100' : 'text-gray-500'}`}>
                                                {new Date(msg.timestamp).toLocaleTimeString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input Area */}
                            <div className="p-4 border-t bg-gray-50">
                                <form onSubmit={handleSendMessage} className="flex gap-2">
                                    <input
                                        type="text"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        placeholder="Nhập tin nhắn..."
                                        className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    />
                                    <button
                                        type="submit"
                                        disabled={!input.trim()}
                                        className="bg-blue-600 text-white rounded-full px-6 py-2 font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
                                    >
                                        Gửi
                                    </button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-gray-400">
                            <div className="text-center">
                                <div className="text-4xl mb-4">💬</div>
                                <p>Chọn một cuộc hội thoại để bắt đầu chat</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
