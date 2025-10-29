import { supabase } from './supabaseClient';
import { SuggestionComplaint, SuggestionComplaintType, SuggestionComplaintStatus } from '../types';

// Helper to handle Supabase errors
const handleSupabaseError = (error: any, context: string) => {
    if (error) {
        console.error(`Error in ${context}:`, error);
        throw error;
    }
};

export const getSuggestionsComplaints = async (): Promise<SuggestionComplaint[]> => {
    const { data, error } = await supabase.from('suggestions_complaints').select('*').order('date', { ascending: false });
    handleSupabaseError(error, 'getSuggestionsComplaints');
    return data || [];
};

export const addSuggestionComplaint = async (s: { userId: string, type: SuggestionComplaintType, text: string }): Promise<SuggestionComplaint> => {
    const newSuggestion = { ...s, date: new Date().toISOString().split('T')[0], status: SuggestionComplaintStatus.NEW };
    const { data, error } = await supabase.from('suggestions_complaints').insert(newSuggestion).select().single();
    handleSupabaseError(error, 'addSuggestionComplaint');
    return data;
};

export const updateSuggestionComplaintStatus = async (id: string, status: SuggestionComplaintStatus) => {
    const { error } = await supabase.from('suggestions_complaints').update({ status }).eq('id', id);
    handleSupabaseError(error, 'updateSuggestionComplaintStatus');
};
