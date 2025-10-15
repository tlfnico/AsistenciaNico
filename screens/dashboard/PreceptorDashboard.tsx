import React, { useMemo, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Card from '../../components/common/Card';
import { mockApiService } from '../../services/mockData';
import Icon from '../../components/common/Icon';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import { ConversationListItem, SuggestionComplaintType } from '../../types';
import UpcomingEventsCard from '../../components/dashboard/UpcomingEventsCard';
import PersonalTasksCard from '../../components/dashboard/PersonalTasksCard';

const FeedbackCard: React.FC = () => {
    const { user } = useAuth();
    const [type, setType] = useState<SuggestionComplaintType>(SuggestionComplaintType.SUGGESTION);
    const [text, setText] = useState('');
    const [feedback, setFeedback] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim() || !user) return;
        
        mockApiService.addSuggestionComplaint({ userId: user.id, type, text });
        
        setFeedback('¡Gracias por tu opinión!');
        setText('');
        setTimeout(() => setFeedback(''), 3000);
    };

    return (
        <Card>
            <div className="flex items-center gap-3 mb-4">
                <Icon name="chat" className="w-8 h-8 text-brand-primary" />
                <h2 className="text-xl font-bold text-brand-text">¿Sugerencias o Quejas?</h2>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
                <textarea 
                    value={text} 
                    onChange={e => setText(e.target.value)}
                    placeholder="Escribe tu mensaje aquí..."
                    rows={4}
                    className="w-full border-gray-300 rounded-md shadow-sm p-2"
                    required
                />
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                    <select value={type} onChange={e => setType(e.target.value as SuggestionComplaintType)} className="border-gray-300 rounded-md shadow-sm p-2">
                        <option value={SuggestionComplaintType.SUGGESTION}>Sugerencia</option>
                        <option value={SuggestionComplaintType.COMPLAINT}>Queja</option>
                    </select>
                    <Button type="submit">Enviar</Button>
                </div>
                 {feedback && <p className="text-green-600 font-semibold text-right">{feedback}</p>}
            </form>
        </Card>
    );
};

const PreceptorDashboard: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const unreadConversations = useMemo((): ConversationListItem[] => {
        if (!user) return [];
        const allConversations = mockApiService.getConversations(user.id);
        return allConversations
            .filter(convo =>
                convo.lastMessage &&
                convo.lastMessage.senderId !== user.id &&
                !convo.lastMessage.readBy.includes(user.id)
            )
            .slice(0, 4);
    }, [user]);

    if (!user) return null;

    return (
        <div className="space-y-6">
             <div>
                <h1 className="text-3xl font-bold text-brand-text">¡Hola, {user.name.split(' ')[0]}!</h1>
                <p className="text-gray-600">Bienvenido al portal de preceptoría.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                         <h2 className="text-xl font-bold text-brand-text mb-4">Acciones Rápidas</h2>
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Button onClick={() => navigate('/asistencia')} className="!py-4 !text-lg flex items-center justify-center gap-2">
                                <Icon name="attendance" className="w-6 h-6" />
                                Tomar Asistencia
                            </Button>
                             <Button onClick={() => navigate('/notificaciones')} variant="secondary" className="!py-4 !text-lg flex items-center justify-center gap-2">
                                <Icon name="notifications" className="w-6 h-6" />
                                Enviar Notificación
                            </Button>
                         </div>
                    </Card>
                    <PersonalTasksCard />
                    <FeedbackCard />
                </div>
                
                <div className="lg:col-span-1 space-y-6">
                    <Card className="bg-blue-50 border-l-4 border-brand-secondary">
                        <div className="flex items-center gap-3 mb-4">
                            <Icon name="chat" className="w-8 h-8 text-brand-primary" />
                            <h2 className="text-xl font-bold text-brand-text">Mensajes No Leídos</h2>
                        </div>
                         <div className="space-y-3">
                            {unreadConversations.length > 0 ? unreadConversations.map(convo => (
                                <div 
                                    key={convo.id} 
                                    onClick={() => navigate(`/chat/${convo.id}`)} 
                                    className="p-3 bg-white rounded-lg border border-blue-200 cursor-pointer hover:bg-blue-100 transition-colors"
                                >
                                    <div className="flex justify-between items-center">
                                        <p className="font-semibold text-brand-text">{convo.name}</p>
                                        <p className="text-xs text-gray-500">{new Date(convo.lastMessage!.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                    </div>
                                    <p className="text-sm text-gray-600 truncate mt-1">{convo.lastMessage!.text}</p>
                                </div>
                            )) : (
                                <p className="text-gray-500">No tienes mensajes nuevos.</p>
                            )}
                        </div>
                         {unreadConversations.length > 0 && (
                            <Link to="/chat" className="mt-4 block text-right font-semibold text-brand-primary hover:underline">
                                Ver todos los chats
                            </Link>
                        )}
                    </Card>
                    <UpcomingEventsCard linkTo="/calendario" />
                </div>
            </div>
        </div>
    );
};

export default PreceptorDashboard;