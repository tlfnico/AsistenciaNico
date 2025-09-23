import React, { useState } from 'react';
import { mockApiService } from '../../services/mockData';
import { CalendarEvent, CalendarEventType } from '../../types';
import Card from '../../components/common/Card';

const getEventTypeColor = (type: CalendarEventType) => {
    switch (type) {
        case CalendarEventType.EXAM: return 'bg-red-500';
        case CalendarEventType.FINAL: return 'bg-red-700';
        case CalendarEventType.ENROLLMENT: return 'bg-blue-500';
        case CalendarEventType.INSTITUTIONAL: return 'bg-green-500';
        default: return 'bg-gray-500';
    }
};

const getEventTextColor = (type: CalendarEventType) => {
    switch (type) {
        case CalendarEventType.EXAM: return 'text-red-500';
        case CalendarEventType.FINAL: return 'text-red-700';
        case CalendarEventType.ENROLLMENT: return 'text-blue-500';
        case CalendarEventType.INSTITUTIONAL: return 'text-green-500';
        default: return 'text-gray-500';
    }
};

const getEventTypeStyles = (type: CalendarEventType) => {
    switch (type) {
        case CalendarEventType.EXAM: 
            return {
                mainBorder: 'border-red-500',
                bg: 'bg-red-50',
                text: 'text-red-800',
                date: 'text-red-700',
            };
        case CalendarEventType.FINAL: 
            return {
                mainBorder: 'border-red-700',
                bg: 'bg-red-100',
                text: 'text-red-900',
                date: 'text-red-800',
            };
        case CalendarEventType.ENROLLMENT: 
            return {
                mainBorder: 'border-blue-500',
                bg: 'bg-blue-50',
                text: 'text-blue-800',
                date: 'text-blue-700',
            };
        case CalendarEventType.INSTITUTIONAL: 
            return {
                mainBorder: 'border-green-500',
                bg: 'bg-green-50',
                text: 'text-green-800',
                date: 'text-green-700',
            };
        default: 
            return { mainBorder: 'border-gray-500', bg: 'bg-gray-100', text: 'text-gray-800', date: 'text-gray-700' };
    }
};

const UpcomingEvents: React.FC<{ events: CalendarEvent[], onEventClick: (event: CalendarEvent) => void }> = ({ events, onEventClick }) => {
    
    const futureEvents = events
        .filter(e => new Date(e.date + 'T00:00:00') >= new Date(new Date().setHours(0,0,0,0)))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const eventsGroupedByMonth = futureEvents.reduce((acc, event) => {
        const monthYear = new Date(event.date + 'T00:00:00').toLocaleString('es-ES', { month: 'long', year: 'numeric' });
        if (!acc[monthYear]) {
            acc[monthYear] = [];
        }
        acc[monthYear].push(event);
        return acc;
    }, {} as Record<string, CalendarEvent[]>);

    return (
        <Card>
            <h2 className="text-2xl font-bold text-brand-text mb-4">Próximos Eventos</h2>
            <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2">
                 {Object.keys(eventsGroupedByMonth).length > 0 ? Object.keys(eventsGroupedByMonth).map(monthYear => (
                    <div key={monthYear}>
                        <h3 className="text-xl font-semibold capitalize text-brand-secondary border-b pb-2 mb-3 sticky top-0 bg-white">{monthYear}</h3>
                         <div className="space-y-3">
                            {eventsGroupedByMonth[monthYear].map(event => {
                                const styles = getEventTypeStyles(event.type);
                                return (
                                    <div key={event.id} onClick={() => onEventClick(event)} className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer border-l-4 transition-transform hover:scale-[1.02] ${styles.bg} ${styles.mainBorder}`}>
                                        <div className="flex-shrink-0 text-center w-14">
                                            <p className={`font-extrabold text-2xl ${styles.date}`}>{new Date(event.date + 'T00:00:00').getDate()}</p>
                                            <p className={`text-sm font-semibold uppercase ${styles.text} opacity-90`}>{new Date(event.date + 'T00:00:00').toLocaleString('es-ES', { month: 'short' })}</p>
                                        </div>
                                        <div className="flex-1">
                                            <p className={`font-semibold ${styles.text}`}>{event.title}</p>
                                            <p className={`text-sm ${styles.text} opacity-80`}>{event.type}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )) : <p className="text-center text-gray-500">No hay eventos próximos.</p>}
            </div>
        </Card>
    );
};


const CalendarScreen: React.FC = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
    const [view, setView] = useState<'month' | 'agenda'>('month');
    const allEvents = mockApiService.getCalendarEvents();

    const changeMonth = (offset: number) => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1));
    };

    const handleDateClick = (day: number) => {
        const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        setSelectedDate(clickedDate);
    };

    const upcomingEvents = allEvents
        .filter(e => new Date(e.date) >= new Date(new Date().toDateString())) // from today onwards
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const eventsGroupedByMonth = upcomingEvents.reduce((acc, event) => {
        const monthYear = new Date(event.date + 'T00:00:00').toLocaleString('es-ES', { month: 'long', year: 'numeric' });
        if (!acc[monthYear]) {
            acc[monthYear] = [];
        }
        acc[monthYear].push(event);
        return acc;
    }, {} as Record<string, CalendarEvent[]>);
    
    // Calendar grid calculation
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startDay = startOfMonth.getDay();
    const daysInMonth = endOfMonth.getDate();
    const monthYearDisplay = currentDate.toLocaleString('es-ES', { month: 'long', year: 'numeric' });
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const blanks = Array.from({ length: startDay }, (_, i) => i);

     const eventsForSelectedDate = allEvents.filter(e => {
        if (!selectedDate) return false;
        const selectedDateString = new Date(Date.UTC(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate())).toISOString().split('T')[0];
        return e.date === selectedDateString;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <h1 className="text-3xl font-bold text-brand-text">Calendario Académico</h1>
                 <div className="flex items-center gap-2 p-1 bg-gray-200 rounded-full">
                    <button onClick={() => setView('month')} className={`px-4 py-1 rounded-full text-sm font-semibold transition-colors ${view === 'month' ? 'bg-white text-brand-primary shadow' : 'text-gray-600'}`}>Mes</button>
                    <button onClick={() => setView('agenda')} className={`px-4 py-1 rounded-full text-sm font-semibold transition-colors ${view === 'agenda' ? 'bg-white text-brand-primary shadow' : 'text-gray-600'}`}>Agenda</button>
                </div>
            </div>

            {view === 'month' && (
                <Card>
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-1 sm:gap-2">
                            <button onClick={() => changeMonth(-12)} className="p-2 rounded-full hover:bg-gray-200 transition-colors" aria-label="Año anterior">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" /></svg>
                            </button>
                            <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-gray-200 transition-colors" aria-label="Mes anterior">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                            </button>
                        </div>
                        <h2 className="text-xl font-bold text-center capitalize text-brand-text">{monthYearDisplay}</h2>
                        <div className="flex items-center gap-1 sm:gap-2">
                            <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-gray-200 transition-colors" aria-label="Mes siguiente">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                            </button>
                             <button onClick={() => changeMonth(12)} className="p-2 rounded-full hover:bg-gray-200 transition-colors" aria-label="Año siguiente">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
                            </button>
                        </div>
                    </div>
                    <div>
                        <div className="grid grid-cols-7 text-center">
                            {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => <div key={day} className="font-bold text-gray-600 py-2 text-sm">{day}</div>)}
                        </div>
                        <div className="grid grid-cols-7 border-t border-l border-gray-200">
                            {blanks.map(b => <div key={`blank-${b}`} className="border-b border-r border-gray-200 bg-gray-50 h-32"></div>)}
                            {days.map(day => {
                                const dateStringForFiltering = new Date(Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), day)).toISOString().split('T')[0];
                                const dayEvents = allEvents.filter(e => e.date === dateStringForFiltering);
                                const fullDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                                const isSelected = selectedDate?.toDateString() === fullDate.toDateString();
                                const isToday = new Date().toDateString() === fullDate.toDateString();
                                
                                return (
                                    <div 
                                        key={day} 
                                        className={`border-b border-r border-gray-200 p-2 h-32 flex flex-col relative transition-colors duration-150 ${isSelected ? 'bg-blue-50' : ''} ${dayEvents.length > 0 ? 'cursor-pointer hover:bg-gray-100' : ''}`} 
                                        onClick={() => handleDateClick(day)}
                                    >
                                        <span className={`text-sm font-medium self-end mb-1 ${isToday ? 'text-white bg-brand-primary rounded-full w-6 h-6 flex items-center justify-center' : 'text-gray-700'}`}>{day}</span>
                                        <div className="flex-grow overflow-y-auto text-left space-y-1">
                                            {dayEvents.map(event => (
                                                <div key={event.id} title={event.title} className="flex items-start gap-1.5 p-1 rounded-md" onClick={() => setSelectedEvent(event)}>
                                                    <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-1 ${getEventTypeColor(event.type)}`}></div>
                                                    <p className={`text-xs font-semibold leading-tight ${getEventTextColor(event.type)}`}>{event.title}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </Card>
            )}

            {view === 'agenda' && (
                 <Card>
                    {Object.keys(eventsGroupedByMonth).map(monthYear => (
                        <div key={monthYear} className="mb-6">
                            <h2 className="text-xl font-bold capitalize text-brand-text border-b pb-2 mb-3">{monthYear}</h2>
                             <div className="space-y-3">
                                {eventsGroupedByMonth[monthYear].map(event => (
                                    <div key={event.id} onClick={() => setSelectedEvent(event)} className="flex items-center gap-4 p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
                                        <div className="flex-shrink-0 text-center w-12">
                                            <p className="font-bold text-lg text-brand-primary">{new Date(event.date + 'T00:00:00').getDate()}</p>
                                            <p className="text-xs text-gray-500">{new Date(event.date + 'T00:00:00').toLocaleString('es-ES', { month: 'short' })}</p>
                                        </div>
                                        <div className={`w-1 h-10 rounded-full ${getEventTypeColor(event.type)}`}></div>
                                        <div>
                                            <p className="font-semibold text-gray-800">{event.title}</p>
                                            <p className="text-sm text-gray-600">{event.type}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </Card>
            )}

            {view === 'month' && selectedDate && eventsForSelectedDate.length > 0 && (
                <Card>
                    <h3 className="text-xl font-bold text-brand-text mb-4">
                        Eventos para el {selectedDate.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                    </h3>
                    <div className="space-y-3">
                        {eventsForSelectedDate.map(event => (
                            <div key={event.id} onClick={() => setSelectedEvent(event)} className="p-3 rounded-lg flex items-center gap-4 cursor-pointer hover:bg-gray-50 border">
                                <div className={`w-3 h-3 rounded-full flex-shrink-0 ${getEventTypeColor(event.type)}`}></div>
                                <div>
                                    <p className="font-semibold text-brand-text">{event.title}</p>
                                    <p className="text-sm text-gray-500">{event.type}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            )}

            <UpcomingEvents events={allEvents} onEventClick={setSelectedEvent} />

            {selectedEvent && (
                 <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={() => setSelectedEvent(null)}>
                    <Card className="w-11/12 max-w-lg" onClick={e => e.stopPropagation()}>
                        <div className={`p-4 rounded-t-lg ${getEventTypeColor(selectedEvent.type)}`}>
                           <h3 className="text-xl font-bold text-white">{selectedEvent.title}</h3>
                        </div>
                        <div className="p-6">
                            <p className="text-sm text-gray-500 uppercase font-semibold">{selectedEvent.type}</p>
                            <p className="text-md font-semibold text-brand-text mt-2">{new Date(selectedEvent.date + 'T00:00:00').toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}</p>
                            <p className="mt-4 text-gray-700">{selectedEvent.description}</p>
                            <div className="text-right mt-6">
                               <button onClick={() => setSelectedEvent(null)} className="font-semibold text-brand-primary hover:underline">Cerrar</button>
                            </div>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default CalendarScreen;