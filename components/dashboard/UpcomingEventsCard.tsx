import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { mockApiService } from '../../services/mockData';
import { CalendarEventType } from '../../types';
import Card from '../common/Card';
import Icon, { IconName } from '../common/Icon';

const getEventTypeStyles = (type: CalendarEventType) => {
    switch (type) {
        case CalendarEventType.EXAM: return { icon: 'academic-cap', color: 'text-red-500' };
        case CalendarEventType.FINAL: return { icon: 'academic-cap', color: 'text-red-700' };
        case CalendarEventType.ENROLLMENT: return { icon: 'edit', color: 'text-blue-500' };
        case CalendarEventType.INSTITUTIONAL: return { icon: 'calendar', color: 'text-green-500' };
        case CalendarEventType.MEETING: return { icon: 'users', color: 'text-purple-500'};
        default: return { icon: 'calendar', color: 'text-gray-500' };
    }
};

interface UpcomingEventsCardProps {
    title?: string;
    maxEvents?: number;
    linkTo?: string;
}

const UpcomingEventsCard: React.FC<UpcomingEventsCardProps> = ({ title = "Próximos Eventos", maxEvents = 5, linkTo }) => {
    const upcomingEvents = useMemo(() => {
        return mockApiService.getCalendarEvents()
            .filter(e => new Date(e.date + 'T00:00:00') >= new Date(new Date().setHours(0, 0, 0, 0)))
            .slice(0, maxEvents);
    }, [maxEvents]);

    return (
        <Card>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-brand-text">{title}</h2>
                {linkTo && <Link to={linkTo} className="text-sm font-semibold text-brand-primary hover:underline">Ver todo</Link>}
            </div>
            <div className="space-y-3">
                {upcomingEvents.length > 0 ? upcomingEvents.map(event => {
                    const styles = getEventTypeStyles(event.type);
                    return (
                        <div key={event.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-50">
                            <Icon name={styles.icon as IconName} className={`w-5 h-5 flex-shrink-0 ${styles.color}`} />
                            <div className='flex-1'>
                                <p className="text-sm font-semibold text-gray-800">{event.title}</p>
                                <p className="text-xs text-gray-500">{new Date(event.date + 'T00:00:00').toLocaleDateString('es-ES', { day: '2-digit', month: 'long' })} - <span className="font-medium">{event.type}</span></p>
                            </div>
                        </div>
                    )
                }) : <p className="text-gray-500 text-center py-4">No hay eventos próximos.</p>}
            </div>
        </Card>
    );
};

export default UpcomingEventsCard;