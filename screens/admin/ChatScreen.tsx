import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { mockApiService } from '../../services/mockData';
import { ConversationListItem, User } from '../../types';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Icon from '../../components/common/Icon';
import CreateGroupModal from '../../components/chat/CreateGroupModal';

const AdminChatScreen: React.FC = () => {
    const { user } = useAuth();
    const [conversations, setConversations] = useState<ConversationListItem[]>([]);
    const [isDirectChatModalOpen, setIsDirectChatModalOpen] = useState(false);
    const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const allUsers = useMemo(() => {
        if (!user) return [];
        return mockApiService.getAllUsers().filter(u => u.id !== user.id);
    }, [user]);

    useEffect(() => {
        if (user) {
            setConversations(mockApiService.getConversations(user.id));
        }
    }, [user]);

    const handleStartNewChat = (otherUser: User) => {
        if (!user) return;
        const newConvo = mockApiService.getOrCreateConversation(user.id, otherUser.id);
        setIsDirectChatModalOpen(false);
        setSearchTerm('');
        navigate(`/chat/${newConvo.id}`);
    };

    const handleCreateGroup = (groupName: string, participantIds: string[]) => {
        if (!user) return;
        const newGroup = mockApiService.createGroup(groupName, participantIds, user.id);
        setIsGroupModalOpen(false);
        navigate(`/chat/${newGroup.id}`);
    };

    const filteredUsers = allUsers.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-brand-text">Chat</h1>
                <div className="flex gap-2">
                    <Button onClick={() => setIsDirectChatModalOpen(true)} variant="secondary">
                        <div className="flex items-center gap-2">
                            <Icon name="chat" className="w-5 h-5" />
                            <span>Nuevo Chat</span>
                        </div>
                    </Button>
                    <Button onClick={() => setIsGroupModalOpen(true)}>
                        <div className="flex items-center gap-2">
                            <Icon name="users" className="w-5 h-5" />
                            <span>Crear Grupo</span>
                        </div>
                    </Button>
                </div>
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

            {isDirectChatModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={() => { setIsDirectChatModalOpen(false); setSearchTerm(''); }}>
                    <Card className="w-11/12 max-w-lg flex flex-col" onClick={e => e.stopPropagation()}>
                        <h2 className="text-2xl font-bold text-brand-text mb-4">Iniciar chat con un usuario</h2>
                        <input
                            type="text"
                            placeholder="Buscar por nombre..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full border-gray-300 rounded-md shadow-sm p-2 mb-4"
                            autoFocus
                        />
                        <div className="space-y-2 max-h-80 overflow-y-auto">
                            {filteredUsers.length > 0 ? filteredUsers.map(u => (
                                <div key={u.id} onClick={() => handleStartNewChat(u)} className="p-3 hover:bg-gray-100 cursor-pointer rounded-lg">
                                    <p className="font-semibold text-brand-text">{u.name}</p>
                                    <p className="text-sm text-gray-500 capitalize">{u.role}</p>
                                </div>
                            )) : (
                                <p className="text-center text-gray-500 p-4">No se encontraron usuarios.</p>
                            )}
                        </div>
                    </Card>
                </div>
            )}

            {user && <CreateGroupModal
                isOpen={isGroupModalOpen}
                onClose={() => setIsGroupModalOpen(false)}
                onCreate={handleCreateGroup}
                currentUser={user}
            />}
        </div>
    );
};

export default AdminChatScreen;