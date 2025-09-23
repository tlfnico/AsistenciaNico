

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { mockApiService, students } from '../../services/mockData';
import { Conversation, Student } from '../../types';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Icon from '../../components/common/Icon';

const PreceptorChatScreen: React.FC = () => {
    const { user } = useAuth();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            setConversations(mockApiService.getConversations(user.id));
        }
    }, [user]);

    const handleStartNewChat = (student: Student) => {
        setIsNewChatModalOpen(false);
        setSearchTerm('');
        navigate(`/chat/${student.id}`);
    };

    const filteredStudents = students.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-brand-text">Chat con Alumnos</h1>
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
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={() => { setIsNewChatModalOpen(false); setSearchTerm(''); }}>
                    <Card className="w-11/12 max-w-lg flex flex-col" onClick={e => e.stopPropagation()}>
                        <h2 className="text-2xl font-bold text-brand-text mb-4">Iniciar chat con un alumno</h2>
                        <input
                            type="text"
                            placeholder="Buscar por nombre..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full border-gray-300 rounded-md shadow-sm p-2 mb-4 focus:ring-brand-primary focus:border-brand-primary"
                            autoFocus
                        />
                        <div className="space-y-2 max-h-80 overflow-y-auto">
                            {filteredStudents.length > 0 ? filteredStudents.map(s => (
                                <div key={s.id} onClick={() => handleStartNewChat(s)} className="p-3 hover:bg-gray-100 cursor-pointer rounded-lg">
                                    <p className="font-semibold text-brand-text">{s.name}</p>
                                    <p className="text-sm text-gray-500">{s.careers.join(', ')} - {s.year}° Año</p>
                                </div>
                            )) : (
                                <p className="text-center text-gray-500 p-4">No se encontraron alumnos.</p>
                            )}
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default PreceptorChatScreen;
