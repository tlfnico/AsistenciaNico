import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import * as api from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { Message, User, Conversation } from '../types';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Icon from '../components/common/Icon';

const ChatBubble: React.FC<{ message: Message; isSender: boolean; senderName?: string; isGroup: boolean }> = ({ message, isSender, senderName, isGroup }) => {
    const bubbleClasses = isSender ? 'bg-brand-primary text-white self-end' : 'bg-gray-200 text-brand-text self-start';
    const timeClasses = isSender ? 'text-blue-200' : 'text-gray-500';

    // System message for group creation
    if (message.senderId === 'system') {
        return (
            <div className="text-center text-xs text-gray-500 py-2">
                {message.text}
            </div>
        );
    }
    
    return (
        <div className={`flex flex-col w-full ${isSender ? 'items-end' : 'items-start'}`}>
            {isGroup && !isSender && <p className="text-xs text-gray-500 ml-3 mb-1">{senderName}</p>}
            <div className={`max-w-xs md:max-w-md lg:max-w-lg rounded-xl px-4 py-3 ${bubbleClasses}`}>
                <p className="whitespace-pre-wrap">{message.text}</p>
            </div>
            <div className="flex items-center gap-1.5 mt-1">
                 <span className={`text-xs ${timeClasses}`}>
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                {isSender && message.readBy.length > 1 && ( // Read by at least one other person
                    <Icon name="check-double" className="w-4 h-4 text-brand-accent" />
                )}
                 {isSender && message.readBy.length <= 1 && (
                    <Icon name="check" className="w-4 h-4 text-brand-accent" />
                )}
            </div>
        </div>
    );
};

const ChatDetailScreen: React.FC = () => {
    const { id: conversationId } = useParams<{ id: string }>();
    const { user: currentUser } = useAuth();
    const [messages, setMessages] = useState<Message[]>([]);
    const [conversation, setConversation] = useState<Conversation | null>(null);
    const [conversationName, setConversationName] = useState('');
    const [newMessage, setNewMessage] = useState('');
    const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const [userCache, setUserCache] = useState<Map<string, User>>(new Map());

    const loadConversation = async () => {
        if (currentUser && conversationId) {
            let convoDetails = await api.getConversationDetails(conversationId);
            
            if (!convoDetails) {
                const participantIds = conversationId.split('-');
                if(participantIds.length === 2) {
                     // Fix: Correctly call the 'getOrCreateConversation' function.
                     convoDetails = await api.getOrCreateConversation(participantIds[0], participantIds[1]);
                } else {
                     setConversationName('Chat no encontrado');
                     return;
                }
            }
            setConversation(convoDetails);
            
            const msgs = await api.getMessages(conversationId);
            setMessages(msgs);

            // Fix: Correctly call the 'markMessagesAsRead' function.
            await api.markMessagesAsRead(currentUser.id, conversationId);
        }
    };

    useEffect(() => {
        loadConversation();
    }, [currentUser, conversationId]);

    useEffect(() => {
        const fetchUsers = async () => {
            if (conversation) {
                const newCache = new Map(userCache);
                let needsUpdate = false;
                for (const userId of conversation.participants) {
                    if (!newCache.has(userId)) {
                        // In a real app, you might fetch users in a batch
                        // Fix: Correctly call the 'getUserById' function.
                        const userProfile = await api.getUserById(userId);
                        if (userProfile) {
                            newCache.set(userId, userProfile);
                            needsUpdate = true;
                        }
                    }
                }
                if (needsUpdate) {
                    setUserCache(newCache);
                }

                if (currentUser) {
                    if (conversation.isGroup) {
                        setConversationName(conversation.name || 'Grupo');
                    } else {
                        const otherUserId = conversation.participants.find(p => p !== currentUser.id);
                        const otherUser = newCache.get(otherUserId || '');
                        // Fix: Correctly access the 'name' property on a potentially undefined user object.
                        setConversationName(otherUser?.name || 'Chat');
                    }
                }
            }
        };
        fetchUsers();
    }, [conversation, currentUser, userCache]);
    
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim() === '' || !currentUser || !conversationId) return;
        
        const tempMessage = newMessage.trim();
        setNewMessage('');
        
        await api.sendMessage(currentUser.id, conversationId, tempMessage);
        
        const updatedMessages = await api.getMessages(conversationId);
        setMessages(updatedMessages);
    };

    if (!conversation) {
        return <div>Cargando conversación...</div>;
    }

    return (
        <div className="h-full flex flex-col">
            <header className="flex items-center p-4 border-b bg-white rounded-t-lg">
                <Link to="/chat" className="text-brand-primary hover:text-blue-800 mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </Link>
                <h1 className="text-xl font-bold text-brand-text">{conversationName}</h1>
                {conversation?.isGroup && (
                    <button onClick={() => setIsMembersModalOpen(true)} className="ml-4 text-gray-500 hover:text-brand-primary" title="Ver miembros del grupo">
                        <Icon name="users" className="w-6 h-6" />
                    </button>
                )}
            </header>
            <Card className="flex-1 overflow-y-auto p-4 rounded-t-none">
                <div className="flex flex-col gap-4">
                    {messages.map(msg => {
                        const sender = userCache.get(msg.senderId);
                        return (
                            <ChatBubble 
                                key={msg.id} 
                                message={msg} 
                                isSender={msg.senderId === currentUser?.id}
                                isGroup={!!conversation?.isGroup}
                                senderName={sender?.name.split(' ')[0]}
                            />
                        )
                    })}
                    <div ref={messagesEndRef} />
                </div>
            </Card>
            <div className="p-4 bg-white border-t rounded-b-lg">
                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Escribe un mensaje..."
                        className="flex-1 border rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-brand-accent"
                    />
                    <Button type="submit" className="rounded-full !p-3">
                        <Icon name="send" className="w-6 h-6" />
                    </Button>
                </form>
            </div>
            {isMembersModalOpen && conversation && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={() => setIsMembersModalOpen(false)}>
                    <Card className="w-11/12 max-w-md" onClick={e => e.stopPropagation()}>
                        <h2 className="text-2xl font-bold text-brand-text mb-4">Miembros del Grupo</h2>
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                            {conversation.participants.map(participantId => {
                                const member = userCache.get(participantId);
                                if (!member) return null;
                                return (
                                    <div key={member.id} className="p-3 bg-gray-50 rounded-lg">
                                        <p className="font-semibold text-brand-text">{member.name}</p>
                                        <p className="text-sm text-gray-500">{member.email}</p>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="mt-6 flex justify-end">
                            <Button onClick={() => setIsMembersModalOpen(false)}>Cerrar</Button>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default ChatDetailScreen;