import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { mockApiService } from '../../services/mockData';
import { ConversationListItem } from '../../types';
import Card from '../../components/common/Card';
import Icon from '../../components/common/Icon';

const ProfessorChatScreen: React.FC = () => {
    const { user } = useAuth();
    const [conversations, setConversations] = useState<ConversationListItem[]>([]);
    const navigate = useNavigate();

    const refreshConversations = () => {
        if (user) {
            setConversations(mockApiService.getConversations(user.id));
        }
    };

    useEffect(() => {
        refreshConversations();
    }, [user]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-brand-text">Chat</h1>
            </div>
            <Card>
                <div className="divide-y divide-gray-200">
                    {conversations.length > 0 ? conversations.map(convo => (
                        <div key={convo.id} onClick={() => navigate(`/chat/${convo.id}`)} className="p-4 hover:bg-gray-50 cursor-pointer">
                           <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    {convo.isGroup && <Icon name="users" className="w-6 h-6 text-gray-400 flex-shrink-0" />}
                                    <h3 className="font-semibold text-lg text-brand-text">{convo.name}</h3>
                                </div>
                                {convo.lastMessage && (
                                    <p className="text-sm text-gray-500 flex-shrink-0 ml-2">{new Date(convo.lastMessage.timestamp).toLocaleDateString('es-ES')}</p>
                                )}
                            </div>
                            <p className="text-gray-600 truncate pl-9">{convo.lastMessage?.text || 'Aún no hay mensajes.'}</p>
                        </div>
                    )) : (
                        <p className="p-4 text-center text-gray-500">No hay conversaciones activas.</p>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default ProfessorChatScreen;