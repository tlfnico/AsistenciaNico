import { supabase } from './supabaseClient';
import { AttendanceRecord, User, Career, Notification, Conversation, Message, CalendarEvent, Note, SuggestionComplaint, Grade, FinalExam, Student, ConversationListItem } from '../types';

// NOTA: Esta es una implementación parcial del servicio API.
// Es necesario crear funciones para todos los tipos de datos, siguiendo estos patrones.
// Se asume que los nombres de las tablas están en plural y en snake_case (p. ej., 'attendance_records').
// Se asume que los nombres de las columnas coinciden con las propiedades camelCase de los tipos (p. ej., 'studentId').
// Esto se puede lograr en PostgreSQL usando identificadores entre comillas.

// == Asistencia ==
export const getStudentAttendance = async (studentId: string): Promise<AttendanceRecord[]> => {
    const { data, error } = await supabase
        .from('attendance_records')
        .select('*')
        .eq('studentId', studentId);
    if (error) throw error;
    return data || [];
};

// == Notificaciones ==
export const getNotifications = async (): Promise<Notification[]> => {
    const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('date', { ascending: false });
    if (error) throw error;
    return data || [];
};

// == Usuarios / Perfiles ==
export const getUserById = async (userId: string): Promise<User | null> => {
     const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
    if (error) {
        console.error('Error fetching user', error);
        return null;
    }
    return data;
};

// == Chat ==
export const getConversations = async (userId: string): Promise<ConversationListItem[]> => {
    // Esta es una consulta compleja que probablemente requeriría una función de base de datos (RPC) para un buen rendimiento.
    // Esta es una versión simplificada.
    const { data, error } = await supabase
        .from('conversations')
        .select('*, participants:conversation_participants(userId)')
        .filter('conversation_participants.userId', 'eq', userId);

    if (error) {
        console.error('Error fetching conversations', error);
        return [];
    }
    
    // Esta parte es compleja y necesita más lógica para obtener el último mensaje y los nombres de los participantes.
    // Por ahora, se devuelve una estructura simplificada.
    const conversations = data as any[];
    const result: ConversationListItem[] = await Promise.all(
        conversations.map(async (convo) => {
             let name = convo.name || 'Chat';
             if (!convo.isGroup) {
                 const otherParticipant = convo.participants.find((p: any) => p.userId !== userId);
                 if (otherParticipant) {
                     const userProfile = await getUserById(otherParticipant.userId);
                     name = userProfile?.name || 'Usuario desconocido';
                 }
             }

            // Obtener último mensaje (simplificado)
            const { data: lastMessageData } = await supabase
                .from('messages')
                .select('*')
                .eq('conversationId', convo.id)
                .order('timestamp', { ascending: false })
                .limit(1)
                .single();

            return {
                id: convo.id,
                name,
                isGroup: convo.isGroup,
                lastMessage: lastMessageData,
            }
        })
    );
    return result.sort((a, b) => {
        if (!a.lastMessage) return 1;
        if (!b.lastMessage) return -1;
        return new Date(b.lastMessage.timestamp).getTime() - new Date(a.lastMessage.timestamp).getTime();
    });
};

export const getMessages = async (conversationId: string): Promise<Message[]> => {
    const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversationId', conversationId)
        .order('timestamp', { ascending: true });
    if (error) throw error;
    return data || [];
};

export const sendMessage = async (senderId: string, conversationId: string, text: string): Promise<Message> => {
    const { data, error } = await supabase
        .from('messages')
        .insert({ senderId, conversationId, text, readBy: [senderId] })
        .select()
        .single();
    if (error) throw error;
    return data;
};


// ... Aquí irían otras funciones de la API
// (getCareers, getSubjects, getCalendarEvents, etc.)

