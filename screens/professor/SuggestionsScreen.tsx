import React, { useState } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Icon from '../../components/common/Icon';
import { useAuth } from '../../hooks/useAuth';
import { mockApiService } from '../../services/mockData';
import { SuggestionComplaintType } from '../../types';

const SuggestionsScreen: React.FC = () => {
    const { user } = useAuth();
    const [type, setType] = useState<SuggestionComplaintType>(SuggestionComplaintType.SUGGESTION);
    const [text, setText] = useState('');
    const [feedback, setFeedback] = useState('');
    const [history, setHistory] = useState(() => user ? mockApiService.getSuggestionsComplaints().filter(s => s.userId === user.id) : []);


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim() || !user) return;
        
        mockApiService.addSuggestionComplaint({ userId: user.id, type, text });
        
        setFeedback('¡Gracias por tu opinión! Tu mensaje ha sido enviado.');
        setText('');
        setHistory(mockApiService.getSuggestionsComplaints().filter(s => s.userId === user.id));
        setTimeout(() => setFeedback(''), 4000);
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-brand-text">Sugerencias</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <div className="flex items-center gap-3 mb-4">
                        <Icon name="chat" className="w-8 h-8 text-brand-primary" />
                        <h2 className="text-xl font-bold text-brand-text">Enviar Sugerencia o Queja</h2>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-3">
                        <textarea 
                            value={text} 
                            onChange={e => setText(e.target.value)}
                            placeholder="Describe tu sugerencia o queja aquí..."
                            rows={6}
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

                <Card>
                    <h2 className="text-xl font-bold text-brand-text mb-4">Historial de Envíos</h2>
                     <div className="space-y-3 max-h-96 overflow-y-auto">
                        {history.length > 0 ? history.map(item => (
                            <div key={item.id} className="p-3 border rounded-lg">
                                <div className="flex justify-between items-center text-sm mb-1">
                                    <span className={`font-semibold ${item.type === SuggestionComplaintType.SUGGESTION ? 'text-purple-600' : 'text-red-600'}`}>{item.type}</span>
                                    <span className="text-gray-500">{new Date(item.date + "T00:00:00").toLocaleDateString()}</span>
                                </div>
                                <p className="text-gray-700">{item.text}</p>
                                <p className="text-xs text-right mt-2 font-bold text-gray-500">Estado: {item.status}</p>
                            </div>
                        )) : (
                            <p className="text-center text-gray-500 py-4">No has enviado ninguna sugerencia o queja.</p>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default SuggestionsScreen;
