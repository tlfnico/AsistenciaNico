

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { mockApiService, preceptors } from '../../services/mockData';
import { Conversation, Preceptor } from '../../types';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Icon from '../../components/common/Icon';

const ChatScreen: React.FC = () => {
    const { user } = useAuth();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            setConversations(mockApiService.getConversations(user.id));
        }
    }, [user]);

    const handleStartNewChat = (preceptor: Preceptor) => {
        setIsNewChatModalOpen(false);
        navigate(`/chat/${preceptor.id}`);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-brand-text">Chat</h1>
                <Button onClick={() => setIsNewChatModalOpen(true)}>
                    <div className="flex items-center gap-2">
                        <Icon name="plus" className="w-5 h-5" />
                        <span>Nuevo Chat</span>
                    </div>
                </Button>
            </div>
            <Card>
                <div className="divide-y divide-gray-200">
                    {conversations.length > 0 ? conversations.map(convo => (
                        <div key={convo.id} onClick={() => navigate(`/chat/${convo.participant.id}`)} className="p-4 hover:bg-gray-50 cursor-pointer">
                            <div className="flex justify-between items-center">
                                <h3 className="font-semibold text-lg text-brand-text">{convo.participant.name}</h3>
                                <p className="text-sm text-gray-500">{new Date(convo.lastMessage.timestamp).toLocaleDateString('es-ES')}</p>
                            </div>
                            <p className="text-gray-600 truncate">{convo.lastMessage.text}</p>
                        </div>
                    )) : (
                        <p className="p-4 text-center text-gray-500">No hay conversaciones activas.</p>
                    )}
                </div>
            </Card>

            {isNewChatModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={() => setIsNewChatModalOpen(false)}>
                    <Card className="w-11/12 max-w-md" onClick={e => e.stopPropagation()}>
                        <h2 className="text-2xl font-bold text-brand-text mb-4">Iniciar chat con un preceptor</h2>
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                            {preceptors.map(p => (
                                <div key={p.id} onClick={() => handleStartNewChat(p)} className="p-3 hover:bg-gray-100 cursor-pointer rounded-lg">
                                    <p className="font-semibold text-brand-text">{p.name}</p>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default ChatScreen;
