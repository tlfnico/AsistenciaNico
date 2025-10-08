import React, { useState } from 'react';
import { mockApiService } from '../../services/mockData';
import { CalendarEvent, CalendarEventType } from '../../types';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Icon from '../../components/common/Icon';

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

const EventModal: React.FC<{ event: Partial<CalendarEvent> | null, onClose: () => void, onSave: () => void }> = ({ event, onClose, onSave }) => {
    const [formData, setFormData] = useState(event || { title: '', date: '', type: CalendarEventType.EXAM, description: '' });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        if (!formData.title || !formData.date || !formData.description) return;

        if ('id' in formData && formData.id) {
            mockApiService.updateCalendarEvent(formData as CalendarEvent);
        } else {
            mockApiService.addCalendarEvent(formData as Omit<CalendarEvent, 'id'>);
        }
        onSave();
    };

    const handleDelete = () => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este evento?')) {
            if ('id' in formData && formData.id) {
                mockApiService.deleteCalendarEvent(formData.id);
                onSave();
            }
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={onClose}>
            <Card className="w-11/12 max-w-lg" onClick={e => e.stopPropagation()}>
                <h3 className="text-2xl font-bold mb-6 text-brand-text">{event?.id ? 'Editar' : 'Nuevo'} Evento</h3>
                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-gray-700">Título</label>
                        <input name="title" value={formData.title} onChange={handleChange} className="w-full border-gray-300 rounded-md shadow-sm p-2 mt-1" />
                    </div>
                     <div>
                        <label className="text-sm font-medium text-gray-700">Fecha</label>
                        <input name="date" type="date" value={formData.date} onChange={handleChange} className="w-full border-gray-300 rounded-md shadow-sm p-2 mt-1" />
                    </div>
                     <div>
                        <label className="text-sm font-medium text-gray-700">Tipo</label>
                        <select name="type" value={formData.type} onChange={handleChange} className="w-full border-gray-300 rounded-md shadow-sm p-2 mt-1">
                            {Object.values(CalendarEventType).map(type => <option key={type} value={type}>{type}</option>)}
                        </select>
                    </div>
                     <div>
                        <label className="text-sm font-medium text-gray-700">Descripción</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} className="w-full border-gray-300 rounded-md shadow-sm p-2 mt-1" rows={3}></textarea>
                    </div>
                </div>
                <div className="mt-6 flex justify-between">
                    <div>
                        {event?.id && <Button variant="danger" onClick={handleDelete}><Icon name="delete" /></Button>}
                    </div>
                    <div className="flex gap-2">
                        <Button variant="secondary" onClick={onClose}>Cancelar</Button>
                        <Button onClick={handleSubmit}>Guardar</Button>
                    </div>
                </div>
            </Card>
        </div>
    );
};

const AcademicCalendarScreen: React.FC = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<CalendarEvent | Partial<CalendarEvent> | null>(null);
    const [allEvents, setAllEvents] = useState<CalendarEvent[]>(() => mockApiService.getCalendarEvents());
    
    const onSave = () => {
        setIsModalOpen(false);
        setEditingEvent(null);
        setAllEvents(mockApiService.getCalendarEvents());
    };
    
    const handleDateClick = (day: number) => {
        const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        setSelectedDate(clickedDate);
    };

    const handleAddNewEvent = () => {
        const newEvent: Partial<CalendarEvent> = {
            title: '',
            date: selectedDate ? new Date(Date.UTC(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate())).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            type: CalendarEventType.EXAM,
            description: ''
        };
        setEditingEvent(newEvent);
        setIsModalOpen(true);
    };

    const handleEditEvent = (event: CalendarEvent) => {
        setEditingEvent(event);
        setIsModalOpen(true);
    };
    
    const eventsForSelectedDate = allEvents.filter(e => {
        if (!selectedDate) return false;
        const selectedDateString = new Date(Date.UTC(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate())).toISOString().split('T')[0];
        return e.date === selectedDateString;
    });
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startDay = startOfMonth.getDay();
    const daysInMonth = endOfMonth.getDate();
    const monthYearDisplay = currentDate.toLocaleString('es-ES', { month: 'long', year: 'numeric' });
    const changeMonth = (offset: number) => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1));
    };
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const blanks = Array.from({ length: startDay }, (_, i) => i);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <h1 className="text-3xl font-bold text-brand-text">Gestionar Calendario</h1>
                <Button onClick={handleAddNewEvent}>
                    <div className='flex items-center gap-2'>
                        <Icon name="plus" className="w-5 h-5"/>
                        <span>Nuevo Evento</span>
                    </div>
                </Button>
            </div>
            
            <Card className="mx-[-1rem] sm:mx-0 overflow-hidden">
                <div className="flex justify-between items-center mb-4 px-4 pt-4 sm:px-0 sm:pt-0">
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
                        {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => <div key={day} className="font-bold text-gray-600 py-2 text-xs sm:text-sm">{day}</div>)}
                    </div>
                    <div className="grid grid-cols-7 border-t border-l border-gray-200">
                        {blanks.map(b => <div key={`blank-${b}`} className="border-b border-r border-gray-200 bg-gray-50 min-h-32"></div>)}
                        {days.map(day => {
                            const dateStringForFiltering = new Date(Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), day)).toISOString().split('T')[0];
                            const dayEvents = allEvents.filter(e => e.date === dateStringForFiltering);
                            const fullDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                            const isSelected = selectedDate?.toDateString() === fullDate.toDateString();
                            const isToday = new Date().toDateString() === fullDate.toDateString();
                            
                            const MAX_EVENTS_TO_SHOW = 2;
                            const eventsToShow = dayEvents.slice(0, MAX_EVENTS_TO_SHOW);
                            const remainingEventsCount = dayEvents.length - eventsToShow.length;

                            return (
                                <div 
                                    key={day} 
                                    className={`border-b border-r border-gray-200 p-1 sm:p-2 min-h-32 flex flex-col relative transition-colors duration-150 ${isSelected ? 'bg-blue-50' : ''} ${dayEvents.length > 0 ? 'cursor-pointer hover:bg-gray-100' : ''}`} 
                                    onClick={() => handleDateClick(day)}
                                >
                                    <span className={`text-sm sm:text-base font-medium self-end mb-1 ${isToday ? 'text-white bg-brand-primary rounded-full w-6 h-6 flex items-center justify-center' : 'text-gray-700'}`}>{day}</span>
                                    <div className="flex-grow text-left space-y-1 overflow-hidden">
                                        {eventsToShow.map(event => (
                                            <div key={event.id} title={event.title} className="flex items-start gap-1.5" onClick={(e) => { e.stopPropagation(); handleEditEvent(event); }}>
                                                <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${getEventTypeColor(event.type)}`}></div>
                                                <div className="flex-1 min-w-0">
                                                    <p className={`text-xs sm:text-sm font-semibold truncate ${getEventTextColor(event.type)}`}>{event.title}</p>
                                                </div>
                                            </div>
                                        ))}
                                        {remainingEventsCount > 0 && (
                                            <div className="text-xs font-bold text-brand-secondary mt-1">
                                                + {remainingEventsCount} más
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </Card>

            {selectedDate && (
                    <Card>
                    <h3 className="text-xl font-bold text-brand-text mb-4">
                        Eventos para el {selectedDate.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                    </h3>
                    <div className="space-y-3">
                        {eventsForSelectedDate.length > 0 ? (
                            eventsForSelectedDate.map(event => (
                                <div key={event.id} className="p-3 rounded-lg flex justify-between items-center border hover:bg-gray-50">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-3 h-3 rounded-full flex-shrink-0 ${getEventTypeColor(event.type)}`}></div>
                                        <div>
                                            <p className="font-semibold text-brand-text">{event.title}</p>
                                            <p className="text-sm text-gray-500">{event.type}</p>
                                        </div>
                                    </div>
                                    <Button variant="secondary" onClick={() => handleEditEvent(event)}>
                                        <Icon name="edit" className="w-5 h-5"/>
                                    </Button>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">No hay eventos para esta fecha.</p>
                        )}
                    </div>
                </Card>
            )}

            {isModalOpen && <EventModal event={editingEvent} onClose={() => { setIsModalOpen(false); setEditingEvent(null); }} onSave={onSave} />}
        </div>
    );
};

export default AcademicCalendarScreen;
