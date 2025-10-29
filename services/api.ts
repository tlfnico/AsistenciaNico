import { supabase } from './supabaseClient';
import { 
    AttendanceRecord, 
    User, 
    Career, 
    Notification, 
    Conversation, 
    Message, 
    CalendarEvent, 
    Note, 
    SuggestionComplaint, 
    Grade, 
    FinalExam, 
    Student, 
    ConversationListItem,
    UserRole,
    Subject,
    Preceptor,
    Admin,
    Professor,
    FinalEnrollment,
    SuggestionComplaintType,
    SuggestionComplaintStatus
} from '../types';

// Helper to handle Supabase errors
const handleSupabaseError = (error: any, context: string) => {
    if (error) {
        console.error(`Error in ${context}:`, error);
        throw error;
    }
};

// --- User Management ---
export const getAllUsers = async (): Promise<(Student | Preceptor | Admin | Professor)[]> => {
    const { data, error } = await supabase.from('profiles').select('*');
    handleSupabaseError(error, 'getAllUsers');
    return data || [];
};

// Fix: Add missing getUserById function
export const getUserById = async (userId: string): Promise<User | null> => {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
    handleSupabaseError(error, 'getUserById');
    return data;
};


export const addUser = async (user: Omit<User, 'id'>) => {
    // This assumes you have a separate trigger/function in Supabase to create an auth user
    // For simplicity here, we're just adding to the profiles table.
    const { data, error } = await supabase.from('profiles').insert(user).select().single();
    handleSupabaseError(error, 'addUser');
    return data;
};

export const updateUser = async (updatedUser: Partial<User> & {id: string}) => {
    const { data, error } = await supabase.from('profiles').update(updatedUser).eq('id', updatedUser.id).select().single();
    handleSupabaseError(error, 'updateUser');
    return data;
};

export const deleteUser = async (userId: string) => {
    const { error } = await supabase.from('profiles').delete().eq('id', userId);
    handleSupabaseError(error, 'deleteUser');
};


// --- Career & Subject Management ---
export const getCareers = async (): Promise<Career[]> => {
    const { data, error } = await supabase.from('careers').select('*, subjects(*)');
    handleSupabaseError(error, 'getCareers');
    return (data as Career[]) || [];
};

export const addCareer = async (career: Omit<Career, 'id'>) => {
    // Separate career and subjects
    const { subjects, ...careerData } = career;
    
    // Insert career
    const { data: newCareer, error: careerError } = await supabase.from('careers').insert(careerData).select().single();
    handleSupabaseError(careerError, 'addCareer (career)');
    if (!newCareer) return null;

    // Insert subjects
    if (subjects && subjects.length > 0) {
        const subjectsWithCareerId = subjects.map(s => ({ ...s, careerId: newCareer.id }));
        const { error: subjectsError } = await supabase.from('subjects').insert(subjectsWithCareerId);
        handleSupabaseError(subjectsError, 'addCareer (subjects)');
    }

    return { ...newCareer, subjects };
};

export const updateCareer = async (updatedCareer: Career) => {
    const { subjects, ...careerData } = updatedCareer;
    
    const { error: careerError } = await supabase.from('careers').update(careerData).eq('id', careerData.id);
    handleSupabaseError(careerError, 'updateCareer (career)');

    // Simplistic subject update: delete existing and insert new ones
    const { error: deleteError } = await supabase.from('subjects').delete().eq('careerId', careerData.id);
    handleSupabaseError(deleteError, 'updateCareer (delete subjects)');

    if (subjects && subjects.length > 0) {
        const subjectsWithCareerId = subjects.map(s => ({ ...s, careerId: careerData.id, id: undefined })); // Ensure new IDs are generated
        const { error: insertError } = await supabase.from('subjects').insert(subjectsWithCareerId);
        handleSupabaseError(insertError, 'updateCareer (insert subjects)');
    }
};

export const deleteCareer = async (careerId: string) => {
    // On cascade should delete subjects if set up in DB
    const { error } = await supabase.from('careers').delete().eq('id', careerId);
    handleSupabaseError(error, 'deleteCareer');
};

export const getSubjectsForCareer = async (careerName: string): Promise<string[]> => {
    const { data: career, error } = await supabase.from('careers').select('id').eq('name', careerName).single();
    if (error || !career) return [];
    
    const { data: subjects, error: subjectError } = await supabase.from('subjects').select('name').eq('careerId', career.id);
    handleSupabaseError(subjectError, 'getSubjectsForCareer');
    return subjects?.map(s => s.name) || [];
};

export const getSubjectsByProfessor = async (professorId: string): Promise<(Subject & { careerName: string })[]> => {
    const { data, error } = await supabase
        .from('subjects')
        .select('*, career:careers(name)')
        .eq('professorId', professorId);
    handleSupabaseError(error, 'getSubjectsByProfessor');
    
    return data?.map((s: any) => ({ ...s, careerName: s.career.name })) || [];
};


// --- Student Data ---
export const getStudentsBySubjectId = async (subjectId: string): Promise<Student[]> => {
    const { data: subject, error: subjectError } = await supabase.from('subjects').select('year, careerId').eq('id', subjectId).single();
    if (subjectError || !subject) return [];
    
    const { data: career, error: careerError } = await supabase.from('careers').select('name').eq('id', subject.careerId).single();
    if (careerError || !career) return [];

    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', UserRole.STUDENT)
        .eq('year', subject.year)
        .contains('careers', [career.name]);
        
    handleSupabaseError(error, 'getStudentsBySubjectId');
    return (data as Student[]) || [];
};

export const getStudentsByCareerAndYear = async (career: string, year: number): Promise<Student[]> => {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', UserRole.STUDENT)
        .eq('year', year)
        .contains('careers', [career]);
    handleSupabaseError(error, 'getStudentsByCareerAndYear');
    return (data as Student[]) || [];
};


// == Asistencia ==
export const getStudentAttendance = async (studentId: string): Promise<AttendanceRecord[]> => {
    const { data, error } = await supabase
        .from('attendance_records')
        .select('*')
        .eq('studentId', studentId);
    handleSupabaseError(error, 'getStudentAttendance');
    return data || [];
};

export const getMonthlyAttendanceForClass = async (studentIds: string[], subject: string, year: number, month: number): Promise<AttendanceRecord[]> => {
    const startDate = `${year}-${String(month + 1).padStart(2, '0')}-01`;
    const endDate = new Date(year, month + 1, 0).toISOString().split('T')[0];

    const { data, error } = await supabase
        .from('attendance_records')
        .select('*')
        .in('studentId', studentIds)
        .eq('subject', subject)
        .gte('date', startDate)
        .lte('date', endDate);
    
    handleSupabaseError(error, 'getMonthlyAttendanceForClass');
    return data || [];
};

export const saveAttendance = async (records: { studentId: string, status: string }[], subject: string, date: string) => {
    const recordsToUpsert = records.map(r => ({ ...r, subject, date }));
    // Upsert to avoid duplicate records for the same student, subject, and date
    const { error } = await supabase.from('attendance_records').upsert(recordsToUpsert, { onConflict: 'studentId,subject,date' });
    handleSupabaseError(error, 'saveAttendance');
};


// == Notificaciones ==
export const getNotifications = async (): Promise<Notification[]> => {
    const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('date', { ascending: false });
    handleSupabaseError(error, 'getNotifications');
    return data || [];
};

export const addNotification = async (notification: Omit<Notification, 'id' | 'date'>) => {
    const newNotification = {
        ...notification,
        date: new Date().toISOString().split('T')[0]
    };
    const { data, error } = await supabase.from('notifications').insert(newNotification).select().single();
    handleSupabaseError(error, 'addNotification');
    return data;
};

// == Chat ==
// (This is a simplified version; a real-world chat backend can be complex)
export const getConversationDetails = async (conversationId: string): Promise<Conversation | undefined> => {
     const { data, error } = await supabase
        .from('conversations')
        .select('*, participants:conversation_participants(userId)')
        .eq('id', conversationId)
        .single();
    handleSupabaseError(error, 'getConversationDetails');
    if (!data) return undefined;
    return { ...data, participants: data.participants.map((p: any) => p.userId) };
};

// Fix: Expanded re-export to include missing chat functions.
export { 
    getConversations, 
    getMessages, 
    sendMessage, 
    getOrCreateConversation, 
    markMessagesAsRead,
    getOrCreateSubjectGroup,
    createGroup,
    getOrCreatePreceptorsGroup,
    getOrCreateProfessorsGroup
} from './api_chat';
export { getCalendarEvents, addCalendarEvent, updateCalendarEvent, deleteCalendarEvent } from './api_calendar';
export { getNotes, addNote, updateNote, deleteNote } from './api_notes';
export { getSuggestionsComplaints, addSuggestionComplaint, updateSuggestionComplaintStatus } from './api_suggestions';
export { getGradesForStudent, getGradesBySubject, addOrUpdateGrade } from './api_grades';
export { getFinalsByProfessor, createFinal, deleteFinal, getAvailableFinalsForStudent, getStudentEnrollments, enrollInFinal, withdrawFromFinal, getEnrolledStudentsForFinal } from './api_finals';

// Fix: Removed all re-declared functions from here to the end of the file.
