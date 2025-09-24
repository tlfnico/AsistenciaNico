import React, { useState, useEffect } from 'react';
import { mockApiService } from '../../services/mockData';
import { Notification, NotificationCategory } from '../../types';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Icon from '../../components/common/Icon';

const getCategoryStyles = (category: NotificationCategory) => {
    switch(category) {
        case NotificationCategory.ACADEMIC: return { border: 'border-blue-500', text: 'text-blue-600', bg: 'bg-blue-50', iconColor: 'text-blue-500' };
        case NotificationCategory.INFORMATIVE: return { border: 'border-green-500', text: 'text-green-600', bg: 'bg-green-50', iconColor: 'text-green-500' };
        case NotificationCategory.URGENT: return { border: 'border-red-600', text: 'text-red-600', bg: 'bg-red-50', iconColor: 'text-red-500' };
        default: return { border: 'border-gray-400', text: 'text-gray-600', bg: 'bg-gray-50', iconColor: 'text-gray-500'};
    }
}

const NotificationPreview: React.FC<{ notification: Omit<Notification, 'id' | 'date'> }> = ({ notification }) => {
    const styles = getCategoryStyles(notification.category);
    const isUrgent = notification.category === NotificationCategory.URGENT;

    return (
        <Card className={`border-l-4 ${styles.border} ${styles.bg}`}>
            <div className="flex justify-between items-start">
                 <div className="flex items-center gap-3">
                    {isUrgent && (
                        <div className="text-red-600 flex-shrink-0">
                            <Icon name="warning" className="h-6 w-6" />
                        </div>
                    )}
                    <div>
                        <p className={`text-sm font-semibold ${styles.text}`}>{notification.category}</p>
                        <h3 className="text-lg font-bold text-brand-text">{notification.title || 'Tu Título Aquí'}</h3>
                    </div>
                </div>
                <p className="text-sm text-gray-500 flex-shrink-0 ml-4">Ahora</p>
            </div>
            <p className="mt-2 text-gray-600">{notification.description || 'El contenido de tu notificación aparecerá aquí.'}</p>
        </Card>
    );
};

const PreceptorNotificationsScreen: React.FC = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState<NotificationCategory>(NotificationCategory.INFORMATIVE);
    const [isUrgent, setIsUrgent] = useState(false);
    const [feedback, setFeedback] = useState('');
    const [sentNotifications, setSentNotifications] = useState<Notification[]>([]);
    const [refreshKey, setRefreshKey] = useState(0);
    
    const notificationCategory = isUrgent ? NotificationCategory.URGENT : category;

    useEffect(() => {
        const allNots = mockApiService.getNotifications();
        setSentNotifications(allNots.slice(0, 10)); // Show last 10
    }, [refreshKey]);


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !description) {
            setFeedback('Por favor, complete todos los campos.');
            return;
        }
        
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
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-brand-text">Enviar Notificaciones</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Form Column */}
                <Card>
                    <h2 className="text-xl font-bold text-brand-text mb-4">Crear Notificación</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Título</label>
                            <input
                                type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                            />
                        </div>
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descripción</label>
                            <textarea
                                id="description" value={description} onChange={(e) => setDescription(e.target.value)}
                                rows={5} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                            ></textarea>
                        </div>
                        
                        <div className="p-3 rounded-md bg-red-50 border border-red-200">
                            <div className="flex items-center">
                                <input id="urgent" type="checkbox" checked={isUrgent} onChange={(e) => setIsUrgent(e.target.checked)}
                                    className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                                />
                                <label htmlFor="urgent" className="ml-3 block text-sm font-medium text-red-800">
                                    Marcar como Urgente
                                </label>
                            </div>
                        </div>

                        {!isUrgent && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
                                <div className="flex flex-wrap gap-2">
                                     {Object.values(NotificationCategory)
                                        .filter(cat => cat !== NotificationCategory.URGENT)
                                        .map(cat => {
                                            const styles = getCategoryStyles(cat);
                                            return (
                                                <button key={cat} type="button" onClick={() => setCategory(cat)}
                                                    className={`px-3 py-1 text-sm font-semibold rounded-full border-2 transition-colors ${category === cat ? `${styles.bg} ${styles.border} ${styles.text}` : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'}`}
                                                >
                                                    {cat}
                                                </button>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        )}

                        <div className="pt-2 flex justify-end">
                            <Button type="submit">Enviar Notificación</Button>
                        </div>
                        {feedback && <p className="text-green-600 font-semibold mt-2 text-right">{feedback}</p>}
                    </form>
                </Card>

                {/* Preview and History Column */}
                <div className="space-y-6">
                     <Card>
                        <h2 className="text-xl font-bold text-brand-text mb-4">Vista Previa</h2>
                        <NotificationPreview notification={{ title, description, category: notificationCategory }} />
                    </Card>
                     <Card>
                        <h2 className="text-xl font-bold text-brand-text mb-4">Historial Reciente</h2>
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                            {sentNotifications.length > 0 ? (
                                sentNotifications.map(n => (
                                    <div key={n.id} className={`p-3 border-l-4 ${getCategoryStyles(n.category).border} ${getCategoryStyles(n.category).bg} rounded-r-md`}>
                                        <div className="flex justify-between items-start text-xs">
                                            <p className={`font-semibold ${getCategoryStyles(n.category).text}`}>{n.category}</p>
                                            <p className="text-gray-500">{new Date(n.date + 'T00:00:00').toLocaleDateString('es-ES')}</p>
                                        </div>
                                        <p className="font-semibold text-brand-text mt-1">{n.title}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-gray-500 py-4">No hay notificaciones recientes.</p>
                            )}
                        </div>
                    </Card>
                </div>

            </div>
        </div>
    );
};

export default PreceptorNotificationsScreen;
