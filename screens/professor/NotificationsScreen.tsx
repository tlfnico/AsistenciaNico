import React, { useState, useEffect, useMemo } from 'react';
import { mockApiService } from '../../services/mockData';
import { Notification, NotificationCategory, Student } from '../../types';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Icon from '../../components/common/Icon';
import { useAuth } from '../../hooks/useAuth';

const getCategoryStyles = (category: NotificationCategory) => {
    switch (category) {
        case NotificationCategory.ACADEMIC: return { border: 'border-blue-500', text: 'text-blue-600', bg: 'bg-blue-50' };
        case NotificationCategory.INFORMATIVE: return { border: 'border-green-500', text: 'text-green-600', bg: 'bg-green-50' };
        case NotificationCategory.URGENT: return { border: 'border-red-600', text: 'text-red-600', bg: 'bg-red-50' };
    }
}

const NotificationPreview: React.FC<{ notification: Omit<Notification, 'id' | 'date'> }> = ({ notification }) => {
    const styles = getCategoryStyles(notification.category);
    return (
        <Card className={`border-l-4 ${styles.border} ${styles.bg}`}>
            <div className="flex justify-between items-start">
                <div>
                    <p className={`text-sm font-semibold ${styles.text}`}>{notification.category}</p>
                    <h3 className="text-lg font-bold text-brand-text">{notification.title || 'Tu Título Aquí'}</h3>
                </div>
                <p className="text-sm text-gray-500 flex-shrink-0 ml-4">Ahora</p>
            </div>
            <p className="mt-2 text-gray-600">{notification.description || 'El contenido de tu notificación aparecerá aquí.'}</p>
        </Card>
    );
};

const ProfessorNotificationsScreen: React.FC = () => {
    const { user } = useAuth();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState<NotificationCategory>(NotificationCategory.ACADEMIC);
    const [feedback, setFeedback] = useState('');
    const [sentNotifications, setSentNotifications] = useState<Notification[]>([]);
    
    // In a real app, this would be more complex, linking notifications to recipients.
    // For this prototype, we just add a global notification.
    useEffect(() => {
        setSentNotifications(mockApiService.getNotifications().slice(0, 5));
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !description) {
            setFeedback('Por favor, complete todos los campos.');
            return;
        }
        
        mockApiService.addNotification({ title, description, category });
        setFeedback('¡Notificación enviada con éxito!');
        setTitle('');
        setDescription('');
        setCategory(NotificationCategory.ACADEMIC);
        setSentNotifications(mockApiService.getNotifications().slice(0, 5));
        setTimeout(() => setFeedback(''), 3000);
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-brand-text">Enviar Notificaciones</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                    <h2 className="text-xl font-bold text-brand-text mb-4">Crear Notificación</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <InputField label="Título" value={title} onChange={setTitle} />
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descripción</label>
                            <textarea
                                id="description" value={description} onChange={(e) => setDescription(e.target.value)}
                                rows={5} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                            ></textarea>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
                            <div className="flex flex-wrap gap-2">
                                {Object.values(NotificationCategory).map(cat => (
                                    <button key={cat} type="button" onClick={() => setCategory(cat)}
                                        className={`px-3 py-1 text-sm font-semibold rounded-full border-2 transition-colors ${category === cat ? `${getCategoryStyles(cat).bg} ${getCategoryStyles(cat).border} ${getCategoryStyles(cat).text}` : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'}`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="pt-2 flex justify-end">
                            <Button type="submit">Enviar</Button>
                        </div>
                        {feedback && <p className="text-green-600 font-semibold mt-2 text-right">{feedback}</p>}
                    </form>
                </Card>

                <div className="space-y-6">
                     <Card>
                        <h2 className="text-xl font-bold text-brand-text mb-4">Vista Previa</h2>
                        <NotificationPreview notification={{ title, description, category }} />
                    </Card>
                     <Card>
                        <h2 className="text-xl font-bold text-brand-text mb-4">Historial Reciente</h2>
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                            {sentNotifications.map(n => (
                                <div key={n.id} className={`p-3 border-l-4 ${getCategoryStyles(n.category).border} ${getCategoryStyles(n.category).bg} rounded-r-md`}>
                                    <div className="flex justify-between items-start text-xs">
                                        <p className={`font-semibold ${getCategoryStyles(n.category).text}`}>{n.category}</p>
                                        <p className="text-gray-500">{new Date(n.date + 'T00:00:00').toLocaleDateString('es-ES')}</p>
                                    </div>
                                    <p className="font-semibold text-brand-text mt-1">{n.title}</p>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

const InputField: React.FC<{ label: string; value: string; onChange: (val: string) => void }> = ({ label, value, onChange }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
        />
    </div>
);

export default ProfessorNotificationsScreen;
