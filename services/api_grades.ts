import { supabase } from './supabaseClient';
import { Grade } from '../types';

// Helper to handle Supabase errors
const handleSupabaseError = (error: any, context: string) => {
    if (error) {
        console.error(`Error in ${context}:`, error);
        throw error;
    }
};

export const getGradesForStudent = async (studentId: string): Promise<Grade[]> => {
    const { data, error } = await supabase.from('grades').select('*').eq('studentId', studentId);
    handleSupabaseError(error, 'getGradesForStudent');
    return data || [];
};

export const getGradesBySubject = async (subjectId: string): Promise<Grade[]> => {
    const { data, error } = await supabase.from('grades').select('*').eq('subjectId', subjectId);
    handleSupabaseError(error, 'getGradesBySubject');
    return data || [];
};

export const addOrUpdateGrade = async (grade: Omit<Grade, 'id'> & { id?: string }): Promise<void> => {
    const { error } = await supabase.from('grades').upsert(grade);
    handleSupabaseError(error, 'addOrUpdateGrade');
};
