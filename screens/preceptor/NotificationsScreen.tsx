
import React, { useState, useEffect } from 'react';
import { mockApiService } from '../../services/mockData';
import { Notification, NotificationCategory } from '../../types';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const getCategoryColor = (category: NotificationCategory) => {
    switch(category) {
        case NotificationCategory.ACADEMIC: return 'border-blue-500';
        case NotificationCategory.INFORMATIVE: return 'border-green-500';
        case NotificationCategory.URGENT: return 'border-red-600';
        default: return 'border-gray-400';
    }
}

const PreceptorNotificationsScreen: React.FC = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState<NotificationCategory>(NotificationCategory.INFORMATIVE);
    const [isUrgent, setIsUrgent] = useState(false);
    const [feedback, setFeedback] = useState('');
    const [sentNotifications, setSentNotifications] = useState<Notification[]>([]);
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        const limitDate = new Date();
        limitDate.setDate(limitDate.getDate() - 7);
        limitDate.setHours(0, 0, 0, 0);

        const allNots = mockApiService.getNotifications();
        const recentNots = allNots.filter(n => new Date(n.date) >= limitDate);

        setSentNotifications(recentNots);
    }, [refreshKey]);


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !description) {
            setFeedback('Por favor, complete todos los campos.');
            return;
        }
        
        const notificationCategory = isUrgent ? NotificationCategory.URGENT : category;

        mockApiService.addNotification({ title, description, category: notificationCategory });
        setFeedback('¡Notificación enviada con éxito!');
        setTitle('');
        setDescription('');
        setIsUrgent(false);
        setCategory(NotificationCategory.INFORMATIVE);
        setRefreshKey(k => k + 1);
        setTimeout(() => setFeedback(''), 3000);
    };

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-brand-text">Notificaciones</h1>
            <Card>
                <h2 className="text-xl font-bold text-brand-text mb-4">Enviar Nueva Notificación</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Título</label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-sm p-2"
                        />
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descripción</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-sm p-2"
                        ></textarea>
                    </div>
                    
                    <div>
                        <div className="flex items-center">
                            <input
                                id="urgent"
                                type="checkbox"
                                checked={isUrgent}
                                onChange={(e) => setIsUrgent(e.target.checked)}
                                className="h-4 w-4 text-brand-primary border-gray-300 rounded focus:ring-brand-primary"
                            />
                            <label htmlFor="urgent" className="ml-2 block text-sm font-medium text-gray-900">
                                Marcar como Urgente
                            </label>
                        </div>
                    </div>

                    {!isUrgent && (
                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Categoría</label>
                            <select
                                id="category"
                                value={category}
                                onChange={(e) => setCategory(e.target.value as NotificationCategory)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-sm p-2"
                            >
                                {Object.values(NotificationCategory)
                                    .filter(cat => cat !== NotificationCategory.URGENT)
                                    .map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))
                                }
                            </select>
                        </div>
                    )}

                    <div className="flex justify-end">
                        <Button type="submit">Enviar Notificación</Button>
                    </div>
                    {feedback && <p className="text-green-600 font-semibold mt-4">{feedback}</p>}
                </form>
            </Card>

            <div className="space-y-4">
                 <h2 className="text-2xl font-bold text-brand-text">Historial de Últimos 7 Días</h2>
                 <div className="space-y-3">
                    {sentNotifications.length > 0 ? (
                        sentNotifications.map(notification => {
                            const isUrgent = notification.category === NotificationCategory.URGENT;
                            return (
                                <Card key={notification.id} className={`!p-3 border-l-4 ${getCategoryColor(notification.category)} ${isUrgent ? 'bg-red-50' : ''}`}>
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-2">
                                            {isUrgent && (
                                                <div className="text-red-600 flex-shrink-0">
                                                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                    </svg>
                                                </div>
                                            )}
                                            <div>
                                                <p className={`text-xs font-semibold ${isUrgent ? 'text-red-700' : 'text-brand-secondary'}`}>{notification.category}</p>
                                                <h3 className="text-base font-bold text-brand-text">{notification.title}</h3>
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-500 flex-shrink-0 ml-4">{new Date(notification.date + 'T00:00:00').toLocaleDateString('es-ES')}</p>
                                    </div>
                                    <p className="mt-1 text-sm text-gray-600">{notification.description}</p>
                                </Card>
                            )
                        })
                    ) : (
                        <Card><p className="text-center text-gray-500">No hay notificaciones en los últimos 7 días.</p></Card>
                    )}
                 </div>
            </div>
        </div>
    );
};

export default PreceptorNotificationsScreen;
