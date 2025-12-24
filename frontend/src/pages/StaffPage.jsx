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
    const selectedRoomRef = useRef(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);

    // Sync selectedRoom state to ref
    useEffect(() => {
        selectedRoomRef.current = selectedRoom;
    }, [selectedRoom]);

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
                    senderName: existingDetails?.senderName || data.sender,
                    lastMessage: data.content,
                    timestamp: data.timestamp,
                    unread: (existingDetails?.unread || 0) + 1,
                    avatar: existingDetails?.avatar,
                    status: existingDetails?.status === 'ended' ? 'pending' : (existingDetails?.status || 'pending'), // Reset if needed
                    consultantId: existingDetails?.status === 'ended' ? null : existingDetails?.consultantId,
                    consultantClerkId: existingDetails?.status === 'ended' ? null : existingDetails?.consultantClerkId,
                    consultantName: existingDetails?.status === 'ended' ? null : existingDetails?.consultantName
                };

                return [updatedDetails, ...others];
            });
        });

        // Global Consultation Updates (Someone accepted/ended)
        newSocket.on('consultation_global_update', (data) => {
            // data: { roomId, status, consultantId, consultantName, consultantClerkId }
            setActiveConversations(prev => prev.map(c =>
                c.roomId === data.roomId ? {
                    ...c,
                    status: data.status,
                    consultantId: data.consultantId,
                    consultantName: data.consultantName,
                    consultantClerkId: data.consultantClerkId
                } : c
            ));

            // Also update selectedRoom if it matches (using ref to access current)
            if (selectedRoomRef.current?.roomId === data.roomId) {
                setSelectedRoom(prev => ({
                    ...prev,
                    status: data.status,
                    consultantId: data.consultantId,
                    consultantName: data.consultantName,
                    consultantClerkId: data.consultantClerkId
                }));
            }
        });

        // Listen for internal messages
        newSocket.on('consultation_update', (data) => {
            setMessages(prev => [...prev, {
                role: 'system',
                content: data.message,
                timestamp: new Date().toISOString()
            }]);
        });

        newSocket.on('consultation_ended', (data) => {
            setMessages(prev => [...prev, {
                role: 'system',
                content: data.message,
                timestamp: new Date().toISOString()
            }]);
        });

        // Listen for messages in the active room
        newSocket.on('receive_message', (data) => {
            setMessages((prev) => [...prev, data]);
        });

        // Listen for read receipts
        newSocket.on('messages_read', ({ roomId, readerRole }) => {
            if (selectedRoomRef.current?.roomId === roomId) {
                setMessages(prev => prev.map(msg => {
                    // If reader is customer, mark staff messages as read
                    if (readerRole === 'customer' && msg.role === 'staff') {
                        return { ...msg, isRead: true };
                    }
                    return msg;
                }));
            }
            // Clear unread if read by staff
            if (readerRole === 'staff') {
                setActiveConversations(prev =>
                    prev.map(c => c.roomId === roomId ? { ...c, unread: 0 } : c)
                );
            }
        });

        return () => newSocket.disconnect();
    }, []); // Empty dependency array -> Run ONCE on mount

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
                sender: m.sender,
                isRead: m.isRead
            })));
        } catch (e) {
            console.error('Failed to fetch history', e);
        }

        // Join the socket room using existing socket
        if (socket) {
            socket.emit('join_room', room.roomId);
            // Mark as read immediately
            socket.emit('mark_read', { roomId: room.roomId, role: 'staff' });
        }

        // Mark as read in UI immediately
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
            staffId: user.id, // Send Clerk ID
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
        <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
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
                            <div className="p-4 border-b bg-gray-50 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 text-white flex items-center justify-center rounded-full bg-blue-600 shadow-md">
                                        <span className="text-base font-bold">
                                            {(selectedRoom.senderName || selectedRoom.sender || 'U').charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <div>
                                        <h2 className="font-bold text-lg text-gray-800">
                                            {selectedRoom.senderName || selectedRoom.sender}
                                        </h2>
                                        <div className="flex items-center gap-2">
                                            <p className="text-xs text-gray-500 flex items-center gap-1">
                                                <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span>
                                                ID: {selectedRoom.roomId}
                                            </p>
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${selectedRoom.status === 'active' ? 'bg-green-100 text-green-700' :
                                                selectedRoom.status === 'ended' ? 'bg-gray-200 text-gray-600' :
                                                    'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {selectedRoom.status === 'active' ? 'Đang tư vấn' :
                                                    selectedRoom.status === 'ended' ? 'Đã kết thúc' : 'Chờ tư vấn'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Controls */}
                                <div>
                                    {(selectedRoom.status === 'pending' || selectedRoom.status === 'ended') && (
                                        <button
                                            onClick={() => socket.emit('accept_consultation', {
                                                roomId: selectedRoom.roomId,
                                                staffId: user.id, // Send Clerk ID (Reliable)
                                                staffName: user.fullName || user.firstName
                                            })}
                                            className="bg-blue-600 text-white px-4 py-2 rounded-full font-bold text-sm hover:bg-blue-700 transition shadow-sm"
                                        >
                                            Nhận Tư Vấn
                                        </button>
                                    )}

                                    {selectedRoom.status === 'active' && (
                                        // Check ownership using Clerk ID (Robust)
                                        (selectedRoom.consultantClerkId === user.id) ? (
                                            <button
                                                onClick={() => socket.emit('end_consultation', { roomId: selectedRoom.roomId, staffId: user.id })}
                                                className="bg-red-100 text-red-600 px-4 py-2 rounded-full font-bold text-sm hover:bg-red-200 transition"
                                            >
                                                Kết Thúc
                                            </button>
                                        ) : (
                                            <div className="flex flex-col items-end">
                                                <div className="text-xs text-gray-500 italic bg-gray-100 px-3 py-1 rounded-full">
                                                    Đang được tư vấn bởi {selectedRoom.consultantName || 'người khác'}
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)).map((msg, idx) => {
                                    if (msg.role === 'system') {
                                        return (
                                            <div key={idx} className="flex justify-center">
                                                <span className="text-xs bg-gray-200 text-gray-600 px-3 py-1 rounded-full italic">
                                                    {msg.content || msg.text}
                                                </span>
                                            </div>
                                        );
                                    }
                                    return (
                                        <div
                                            key={idx}
                                            className={`flex flex-col ${msg.role === 'staff' ? 'items-end' : 'items-start'}`}
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
                                            {/* Read Receipt (Only for last message from Staff) */}
                                            {msg.role === 'staff' && idx === messages.filter(m => m.role === 'staff').length - 1 + (messages.length - messages.filter(m => m.role === 'staff').length) && msg.isRead && (
                                                <span className="text-[10px] text-gray-400 mt-1 mr-1">Đã xem</span>
                                            )}
                                            {/* Better Logic: just check if it's the very last message of the thread and isRead */}
                                            {msg.role === 'staff' && msg.isRead && idx === messages.length - 1 && (
                                                <span className="text-[10px] text-gray-400 mt-1 mr-1">Đã xem</span>
                                            )}
                                        </div>
                                    )
                                })}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input Area */}
                            {(selectedRoom.status === 'active' && selectedRoom.consultantClerkId === user.id) ? (
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
                            ) : (
                                <div className="p-4 border-t bg-gray-100 text-center text-gray-500 text-sm">
                                    {selectedRoom.status === 'pending' ? 'Vui lòng nhận tư vấn để bắt đầu chat.' :
                                        selectedRoom.status === 'ended' ? 'Cuộc hội thoại đã kết thúc.' :
                                            'Bạn không có quyền chat trong cuộc hội thoại này.'}
                                </div>
                            )}
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
