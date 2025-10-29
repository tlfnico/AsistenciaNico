import { supabase } from './supabaseClient';
import { Note } from '../types';

// Helper to handle Supabase errors
const handleSupabaseError = (error: any, context: string) => {
    if (error) {
        console.error(`Error in ${context}:`, error);
        throw error;
    }
};

export const getNotes = async (userId: string): Promise<Note[]> => {
    const { data, error } = await supabase.from('notes').select('*').eq('userId', userId).order('date', { ascending: false });
    handleSupabaseError(error, 'getNotes');
    return data || [];
};

export const addNote = async (userId: string, text: string, date: string): Promise<Note> => {
    const { data, error } = await supabase.from('notes').insert({ userId, text, date, lastUpdated: new Date().toISOString() }).select().single();
    handleSupabaseError(error, 'addNote');
    return data;
};

export const updateNote = async (noteId: string, text: string, date: string): Promise<Note> => {
    const { data, error } = await supabase.from('notes').update({ text, date, lastUpdated: new Date().toISOString() }).eq('id', noteId).select().single();
    handleSupabaseError(error, 'updateNote');
    return data;
};

export const deleteNote = async (noteId: string) => {
    const { error } = await supabase.from('notes').delete().eq('id', noteId);
    handleSupabaseError(error, 'deleteNote');
};
