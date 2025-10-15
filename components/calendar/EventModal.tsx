import React, { useState } from 'react';
import { CalendarEvent, CalendarEventType } from '../../types';
import { mockApiService } from '../../services/mockData';
import Card from '../common/Card';
import Button from '../common/Button';
import Icon from '../common/Icon';

interface EventModalProps {
    event: Partial<CalendarEvent> | null;
    onClose: () => void;
    onSave: () => void;
    allowedEventTypes?: CalendarEventType[];
}

const EventModal: React.FC<EventModalProps> = ({ event, onClose, onSave, allowedEventTypes }) => {
    const [formData, setFormData] = useState(event || { title: '', date: '', type: allowedEventTypes ? allowedEventTypes[0] : CalendarEventType.EXAM, description: '' });

    const eventTypeOptions = allowedEventTypes ? Object.values(CalendarEventType).filter(type => allowedEventTypes.includes(type)) : Object.values(CalendarEventType);

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
                            {eventTypeOptions.map(type => <option key={type} value={type}>{type}</option>)}
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

export default EventModal;