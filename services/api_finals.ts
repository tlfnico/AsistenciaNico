import { supabase } from './supabaseClient';
import { FinalExam, Student } from '../types';
import { getCareers } from './api';

// Helper to handle Supabase errors
const handleSupabaseError = (error: any, context: string) => {
    if (error) {
        console.error(`Error in ${context}:`, error);
        throw error;
    }
};

export const getFinalsByProfessor = async (professorId: string): Promise<FinalExam[]> => {
    const { data, error } = await supabase.from('final_exams').select('*').eq('professorId', professorId);
    handleSupabaseError(error, 'getFinalsByProfessor');
    return data || [];
};

export const createFinal = async (finalData: Omit<FinalExam, 'id'>): Promise<void> => {
    const { error } = await supabase.from('final_exams').insert(finalData);
    handleSupabaseError(error, 'createFinal');
};

export const deleteFinal = async (finalId: string): Promise<void> => {
    // Cascade delete should handle enrollments
    const { error } = await supabase.from('final_exams').delete().eq('id', finalId);
    handleSupabaseError(error, 'deleteFinal');
};

export const getAvailableFinalsForStudent = async (student: Student): Promise<FinalExam[]> => {
    // This is a complex query. A database function (RPC) would be ideal.
    // Simplified client-side version:
    const allCareers = await getCareers();
    const studentSubjectIds = allCareers
        .filter(c => student.careers.includes(c.name))
        .flatMap(c => c.subjects)
        .filter(s => s.year <= student.year)
        .map(s => s.id);

    if (studentSubjectIds.length === 0) return [];

    const { data: allFinals, error: finalsError } = await supabase.from('final_exams').select('*').in('subjectId', studentSubjectIds);
    handleSupabaseError(finalsError, 'getAvailableFinalsForStudent (all finals)');
    if (!allFinals) return [];

    const { data: enrollments, error: enrollError } = await supabase.from('final_enrollments').select('finalId').eq('studentId', student.id);
    handleSupabaseError(enrollError, 'getAvailableFinalsForStudent (enrollments)');
    const enrolledIds = new Set((enrollments || []).map(e => e.finalId));
    
    return allFinals.filter(f => !enrolledIds.has(f.id));
};

export const getStudentEnrollments = async (studentId: string): Promise<FinalExam[]> => {
    const { data, error } = await supabase
        .from('final_enrollments')
        .select('final:final_exams(*)')
        .eq('studentId', studentId);
    handleSupabaseError(error, 'getStudentEnrollments');
    return data?.map((e: any) => e.final) || [];
};

export const enrollInFinal = async (studentId: string, finalId: string): Promise<{success: boolean, message?: string}> => {
    // Check capacity first
    const { data: final, error: finalError } = await supabase.from('final_exams').select('capacity').eq('id', finalId).single();
    if (finalError || !final) return { success: false, message: "Final not found."};
    
    const { count, error: countError } = await supabase.from('final_enrollments').select('*', { count: 'exact', head: true }).eq('finalId', finalId);
    if (countError) return { success: false, message: "Could not verify capacity."};
    
    if (count !== null && count >= final.capacity) {
        return { success: false, message: "No hay más cupos para este final."};
    }

    const { error } = await supabase.from('final_enrollments').insert({ studentId, finalId });
    if (error) {
        if (error.code === '23505') return { success: false, message: "Ya estás inscripto." };
        handleSupabaseError(error, 'enrollInFinal');
        return { success: false, message: "Error en la inscripción."};
    }
    return { success: true };
};

export const withdrawFromFinal = async (studentId: string, finalId: string): Promise<void> => {
    const { error } = await supabase.from('final_enrollments').delete().match({ studentId, finalId });
    handleSupabaseError(error, 'withdrawFromFinal');
};

export const getEnrolledStudentsForFinal = async (finalId: string): Promise<Student[]> => {
    const { data, error } = await supabase
        .from('final_enrollments')
        .select('student:profiles(*)')
        .eq('finalId', finalId);
    handleSupabaseError(error, 'getEnrolledStudentsForFinal');
    return data?.map((e: any) => e.student) || [];
};
