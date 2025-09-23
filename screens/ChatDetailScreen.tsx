
import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockApiService } from '../services/mockData';
import { useAuth } from '../hooks/useAuth';
import { Message, User } from '../types';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Icon from '../components/common/Icon';
import { users } from '../services/mockData';

const ChatBubble: React.FC<{ message: Message; isSender: boolean }> = ({ message, isSender }) => {
    const bubbleClasses = isSender ? 'bg-brand-primary text-white self-end' : 'bg-gray-200 text-brand-text self-start';
    const timeClasses = isSender ? 'text-blue-200' : 'text-gray-500';
    
    return (
        <div className={`flex flex-col ${isSender ? 'items-end' : 'items-start'}`}>
            <div className={`max-w-xs md:max-w-md lg:max-w-lg rounded-xl px-4 py-3 ${bubbleClasses}`}>
                <p>{message.text}</p>
            </div>
            <div className="flex items-center gap-1.5 mt-1">
                 <span className={`text-xs ${timeClasses}`}>
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                {isSender && message.readTimestamp && (
                    <Icon name="check-double" className="w-4 h-4 text-brand-accent" />
                )}
            </div>
        </div>
    );
};

const ChatDetailScreen: React.FC = () => {
    const { id: otherUserId } = useParams<{ id: string }>();
    const { user: currentUser } = useAuth();
    const [messages, setMessages] = useState<Message[]>([]);
    const [otherUser, setOtherUser] = useState<User | undefined>();
    const [newMessage, setNewMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const typingTimeoutRef = useRef<number | null>(null);

    // Effect to mark messages as read on component mount
    useEffect(() => {
        if (currentUser && otherUserId) {
            mockApiService.markMessagesAsRead(currentUser.id, otherUserId);
            setMessages(mockApiService.getMessages(currentUser.id, otherUserId));
            setOtherUser(users.find(u => u.id === otherUserId));
        }
    }, [currentUser, otherUserId]);
    
    // Effect to scroll to bottom when new messages arrive or typing indicator appears
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
        };
    }, []);

    // Simulates the other user typing
    const simulateTyping = () => {
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = window.setTimeout(() => {
            setIsTyping(true);
            // Stop typing after a random interval
            const stopTypingTimeout = setTimeout(() => setIsTyping(false), Math.random() * 2000 + 2000);
        }, 1000); // Start "typing" 1 second after user stops typing
    };

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim() === '' || !currentUser || !otherUserId) return;
        
        // Stop any ongoing typing simulation
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        setIsTyping(false);

        mockApiService.sendMessage(currentUser.id, otherUserId, newMessage.trim());
        setMessages(mockApiService.getMessages(currentUser.id, otherUserId));
        setNewMessage('');
    };

    if (!otherUser) {
        return <div>Usuario no encontrado.</div>;
    }

    return (
        <div className="h-full flex flex-col">
            <header className="flex items-center p-4 border-b bg-white rounded-t-lg">
                <Link to="/chat" className="text-brand-primary hover:text-blue-800 mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </Link>
                <h1 className="text-xl font-bold text-brand-text">{otherUser.name}</h1>
            </header>
            <Card className="flex-1 overflow-y-auto p-4 rounded-t-none">
                <div className="flex flex-col gap-4">
                    {messages.map(msg => (
                        <ChatBubble key={msg.id} message={msg} isSender={msg.senderId === currentUser?.id} />
                    ))}
                     {isTyping && (
                        <div className="flex items-center gap-2 self-start">
                            <div className="bg-gray-200 rounded-xl px-4 py-3">
                                <div className="flex items-center justify-center gap-1 h-5">
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </Card>
            <div className="p-4 bg-white border-t rounded-b-lg">
                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => {
                            setNewMessage(e.target.value)
                            simulateTyping();
                        }}
                        placeholder="Escribe un mensaje..."
                        className="flex-1 border rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-brand-accent"
                    />
                    <Button type="submit" className="rounded-full !p-3">
                        <Icon name="send" className="w-6 h-6" />
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default ChatDetailScreen;