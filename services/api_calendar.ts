import { supabase } from './supabaseClient';
import { CalendarEvent } from '../types';

// Helper to handle Supabase errors
const handleSupabaseError = (error: any, context: string) => {
    if (error) {
        console.error(`Error in ${context}:`, error);
        throw error;
    }
};

export const getCalendarEvents = async (): Promise<CalendarEvent[]> => {
    const { data, error } = await supabase
        .from('calendar_events')
        .select('*')
        .order('date', { ascending: true });
    handleSupabaseError(error, 'getCalendarEvents');
    return data || [];
};

export const addCalendarEvent = async (event: Omit<CalendarEvent, 'id'>): Promise<CalendarEvent> => {
    const { data, error } = await supabase
        .from('calendar_events')
        .insert(event)
        .select()
        .single();
    handleSupabaseError(error, 'addCalendarEvent');
    return data;
};

export const updateCalendarEvent = async (updatedEvent: CalendarEvent): Promise<CalendarEvent> => {
    const { data, error } = await supabase
        .from('calendar_events')
        .update(updatedEvent)
        .eq('id', updatedEvent.id)
        .select()
        .single();
    handleSupabaseError(error, 'updateCalendarEvent');
    return data;
};

export const deleteCalendarEvent = async (eventId: string): Promise<void> => {
    const { error } = await supabase
        .from('calendar_events')
        .delete()
        .eq('id', eventId);
    handleSupabaseError(error, 'deleteCalendarEvent');
};
