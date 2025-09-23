
import React, { useState, useMemo } from 'react';
import { mockApiService } from '../../services/mockData';
import { Notification, NotificationCategory } from '../../types';
import Card from '../../components/common/Card';

const getCategoryColor = (category: NotificationCategory) => {
    switch(category) {
        case NotificationCategory.ACADEMIC: return 'border-blue-500';
        case NotificationCategory.INFORMATIVE: return 'border-green-500';
        case NotificationCategory.URGENT: return 'border-red-600';
    }
}

const NotificationItem: React.FC<{ notification: Notification }> = ({ notification }) => {
    const isUrgent = notification.category === NotificationCategory.URGENT;

    return (
        <Card className={`border-l-4 ${getCategoryColor(notification.category)} ${isUrgent ? 'bg-red-50' : ''}`}>
            <div className="flex justify-between items-start">
                 <div className="flex items-center gap-3">
                    {isUrgent && (
                        <div className="text-red-600 flex-shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                    )}
                    <div>
                        <p className={`text-sm font-semibold ${isUrgent ? 'text-red-700' : 'text-brand-secondary'}`}>{notification.category}</p>
                        <h3 className="text-lg font-bold text-brand-text">{notification.title}</h3>
                    </div>
                </div>
                <p className="text-sm text-gray-500 flex-shrink-0 ml-4">{new Date(notification.date + 'T00:00:00').toLocaleDateString('es-ES')}</p>
            </div>
            <p className="mt-2 text-gray-600">{notification.description}</p>
        </Card>
    );
};

const NotificationsScreen: React.FC = () => {
    const allNotifications = mockApiService.getNotifications();
    const [filter, setFilter] = useState<NotificationCategory | 'all'>('all');

    const filteredNotifications = useMemo(() => {
        if (filter === 'all') {
            return allNotifications;
        }
        return allNotifications.filter(n => n.category === filter);
    }, [filter, allNotifications]);
    
    const categories: ('all' | NotificationCategory)[] = ['all', ...Object.values(NotificationCategory)];

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-brand-text">Notificaciones</h1>
            
            <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setFilter(cat)}
                        className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${filter === cat ? 'bg-brand-primary text-white' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'}`}
                    >
                        {cat === 'all' ? 'Todas' : cat}
                    </button>
                ))}
            </div>

            <div className="space-y-4">
                {filteredNotifications.length > 0 ? (
                    filteredNotifications.map(notification => <NotificationItem key={notification.id} notification={notification} />)
                ) : (
                    <Card><p className="text-center text-gray-500">No hay notificaciones en esta categoría.</p></Card>
                )}
            </div>
        </div>
    );
};

export default NotificationsScreen;
