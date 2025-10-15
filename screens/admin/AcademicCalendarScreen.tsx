import React, { useMemo, useState } from 'react';
import Card from '../../components/common/Card';
import UpcomingEventsCard from '../../components/dashboard/UpcomingEventsCard';
import PersonalTasksCard from '../../components/dashboard/PersonalTasksCard';
import { CalendarEvent, CalendarEventType } from '../../types';
import { mockApiService } from '../../services/mockData';
import Icon, { IconName } from '../../components/common/Icon';
import Button from '../../components/common/Button';
import EventModal from '../../components/calendar/EventModal';

const getEventTypeStyles = (type: CalendarEventType) => {
    switch (type) {
        case CalendarEventType.EXAM: return { color: 'bg-red-500', icon: 'academic-cap', iconColor: 'text-red-700' };
        case CalendarEventType.FINAL: return { color: 'bg-red-700', icon: 'academic-cap', iconColor: 'text-red-800' };
        case CalendarEventType.ENROLLMENT: return { color: 'bg-blue-500', icon: 'edit', iconColor: 'text-blue-700' };
        case CalendarEventType.INSTITUTIONAL: return { color: 'bg-green-500', icon: 'calendar', iconColor: 'text-green-700' };
        case CalendarEventType.MEETING: return { color: 'bg-purple-500', icon: 'users', iconColor: 'text-purple-700' };
        default: return { color: 'bg-gray-500', icon: 'calendar', iconColor: 'text-gray-700' };
    }
};

const InteractiveCalendar: React.FC = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [events, setEvents] = useState(() => mockApiService.getCalendarEvents());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<Partial<CalendarEvent> | null>(null);
    
    const refreshEvents = () => setEvents(mockApiService.getCalendarEvents());

    const handleOpenModal = (event: Partial<CalendarEvent> | null) => {
        setEditingEvent(event);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingEvent(null);
    };

    const handleSave = () => {
        refreshEvents();
        handleCloseModal();
    };

    const eventsByDate = useMemo(() => {
        return events.reduce((acc, event) => {
            const date = event.date;
            if (!acc[date]) acc[date] = [];
            acc[date].push(event);
            return acc;
        }, {} as Record<string, CalendarEvent[]>);
    }, [events]);

    const changeMonth = (offset: number) => {
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
    };

    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startDay = startOfMonth.getDay();
    const daysInMonth = endOfMonth.getDate();
    const monthYearDisplay = currentDate.toLocaleString('es-ES', { month: 'long', year: 'numeric' });
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const blanks = Array.from({ length: startDay });

    const selectedDateString = selectedDate.toISOString().split('T')[0];
    const eventsForSelectedDate = eventsByDate[selectedDateString] || [];
    
    return (
        <>
            <Card>
                <div className="flex justify-between items-center mb-4">
                    <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-gray-200 transition-colors" aria-label="Mes anterior">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <h2 className="text-xl font-bold text-center capitalize text-brand-text">{monthYearDisplay}</h2>
                    <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-gray-200 transition-colors" aria-label="Mes siguiente">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </button>
                </div>
                <div className="grid grid-cols-7 text-center">
                    {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => <div key={day} className="font-bold text-gray-600 py-2 text-sm">{day}</div>)}
                </div>
                <div className="grid grid-cols-7 border-t border-l">
                    {blanks.map((_, i) => <div key={`blank-${i}`} className="border-b border-r bg-gray-50 min-h-[80px] sm:min-h-[100px]"></div>)}
                    {days.map(day => {
                        const fullDate = new Date(Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), day));
                        const dateString = fullDate.toISOString().split('T')[0];
                        const dayEvents = eventsByDate[dateString] || [];
                        const isToday = new Date().toDateString() === fullDate.toDateString();
                        const isSelected = selectedDate.toDateString() === fullDate.toDateString();

                        return (
                            <div key={day} onClick={() => setSelectedDate(fullDate)} className={`border-b border-r p-2 flex flex-col min-h-[80px] sm:min-h-[100px] cursor-pointer transition-colors ${isSelected ? 'bg-brand-accent' : 'hover:bg-gray-50'}`}>
                                <span className={`text-sm font-medium self-end ${isToday ? 'text-white bg-brand-primary rounded-full w-6 h-6 flex items-center justify-center' : 'text-gray-700'}`}>{day}</span>
                                <div className="flex-grow mt-1 flex flex-wrap gap-1">
                                    {dayEvents.map(event => (
                                        <div key={event.id} title={event.title} className={`w-2 h-2 rounded-full ${getEventTypeStyles(event.type).color}`}></div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="border-t mt-4 pt-4">
                    <h3 className="font-bold text-lg mb-2 text-brand-text">
                        Eventos para el {selectedDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}
                    </h3>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                        {eventsForSelectedDate.length > 0 ? (
                            eventsForSelectedDate.map(event => {
                                const styles = getEventTypeStyles(event.type);
                                return (
                                <div key={event.id} onClick={() => handleOpenModal(event)} className="p-3 rounded-md bg-gray-50 flex gap-3 items-start cursor-pointer hover:bg-gray-100">
                                    <div className={`mt-1 flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full ${styles.color} bg-opacity-20`}>
                                        <Icon name={styles.icon as IconName} className={`w-3 h-3 ${styles.iconColor}`} />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-800">{event.title}</p>
                                        <p className="text-sm text-gray-600">{event.description}</p>
                                        <p className="text-xs font-bold text-gray-500 mt-1">{event.type}</p>
                                    </div>
                                </div>
                            )})
                        ) : (
                            <p className="text-gray-500 text-sm text-center py-4">No hay eventos para este día.</p>
                        )}
                    </div>
                    <Button onClick={() => handleOpenModal({ date: selectedDateString })} className="w-full mt-4 flex items-center justify-center gap-2">
                        <Icon name="plus" className="w-5 h-5" /> Añadir Evento
                    </Button>
                </div>
            </Card>
            {isModalOpen && (
                <EventModal
                    event={editingEvent}
                    onClose={handleCloseModal}
                    onSave={handleSave}
                    allowedEventTypes={Object.values(CalendarEventType)}
                />
            )}
        </>
    );
};

const AcademicCalendarScreen: React.FC = () => {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-brand-text">Calendario Académico y Tareas</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <InteractiveCalendar />
                </div>
                <div className="space-y-6">
                    <UpcomingEventsCard linkTo="/calendario-academico" />
                    <PersonalTasksCard />
                </div>
            </div>
        </div>
    );
};

export default AcademicCalendarScreen;