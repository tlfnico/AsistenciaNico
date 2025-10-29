import { supabase } from './supabaseClient';
import { Conversation, Message, ConversationListItem, User } from '../types';

// Helper to handle Supabase errors
const handleSupabaseError = (error: any, context: string) => {
    if (error) {
        console.error(`Error in ${context}:`, error);
        throw error;
    }
};

export const getConversations = async (userId: string): Promise<ConversationListItem[]> => {
    const { data, error } = await supabase.rpc('get_user_conversations_with_details', { p_user_id: userId });
    handleSupabaseError(error, 'getConversations');

    return (data || []).map((c: any) => ({
        id: c.id,
        name: c.name,
        isGroup: c.is_group,
        lastMessage: c.last_message ? {
            id: c.last_message.id,
            senderId: c.last_message.sender_id,
            conversationId: c.last_message.conversation_id,
            text: c.last_message.text,
            timestamp: c.last_message.timestamp,
            readBy: c.last_message.read_by,
        } : undefined,
    })).sort((a, b) => {
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
    handleSupabaseError(error, 'getMessages');
    return data || [];
};

export const sendMessage = async (senderId: string, conversationId: string, text: string): Promise<Message> => {
    const { data, error } = await supabase
        .from('messages')
        .insert({ senderId, conversationId, text, readBy: [senderId] })
        .select()
        .single();
    handleSupabaseError(error, 'sendMessage');
    return data;
};

export const getOrCreateConversation = async (participant1Id: string, participant2Id: string): Promise<Conversation> => {
    const { data, error } = await supabase.rpc('get_or_create_conversation', {
        p_participant1_id: participant1Id,
        p_participant2_id: participant2Id
    });
    handleSupabaseError(error, 'getOrCreateConversation');
    return data;
};

export const getOrCreateSubjectGroup = async (subjectId: string, subjectName: string, professorId: string): Promise<Conversation> => {
     const { data, error } = await supabase.rpc('get_or_create_subject_group', {
        p_subject_id: subjectId,
        p_subject_name: subjectName,
        p_professor_id: professorId
    });
    handleSupabaseError(error, 'getOrCreateSubjectGroup');
    return data;
};

export const createGroup = async (groupName: string, participantIds: string[], creatorId: string): Promise<Conversation> => {
    const finalParticipants = [...new Set([creatorId, ...participantIds])];
    const { data, error } = await supabase.rpc('create_group_conversation', {
        p_name: groupName,
        p_participant_ids: finalParticipants
    });
    handleSupabaseError(error, 'createGroup');
    return data;
};

export const getOrCreatePreceptorsGroup = async (creatorId: string): Promise<Conversation> => {
     const { data, error } = await supabase.rpc('get_or_create_role_group', {
        p_role_name: 'preceptor',
        p_group_name: 'Grupo de Preceptores',
        p_creator_id: creatorId
    });
    handleSupabaseError(error, 'getOrCreatePreceptorsGroup');
    return data;
};
export const getOrCreateProfessorsGroup = async (creatorId: string): Promise<Conversation> => {
     const { data, error } = await supabase.rpc('get_or_create_role_group', {
        p_role_name: 'professor',
        p_group_name: 'Grupo de Profesores',
        p_creator_id: creatorId
    });
    handleSupabaseError(error, 'getOrCreateProfessorsGroup');
    return data;
};

export const markMessagesAsRead = async (readerId: string, conversationId: string): Promise<void> => {
    const { error } = await supabase.rpc('mark_messages_as_read', {
        p_conversation_id: conversationId,
        p_reader_id: readerId
    });
    handleSupabaseError(error, 'markMessagesAsRead');
};
