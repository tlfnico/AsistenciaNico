import { ReactNode } from "react";

export enum UserRole {
    STUDENT = 'student',
    PRECEPTOR = 'preceptor',
    ADMIN = 'admin',
    PROFESSOR = 'professor'
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
}

export interface Student extends User {
    dni: string;
    careers: string[];
    year: number;
}

export interface Preceptor extends User {}

export interface Professor extends User {
    subjects: string[]; // Array of subject IDs
}

export interface Admin extends User {}

export interface Subject {
    id:string;
    name: string;
    year: number;
    professorId?: string;
}

export interface Career {
    id: string;
    name: string;
    subjects: Subject[];
}

export enum AttendanceStatus {
    PRESENT = 'Presente',
    ABSENT = 'Ausente',
    LATE = 'Tarde'
}

export interface AttendanceRecord {
    id: string;
    studentId: string;
    date: string;
    subject: string;
    status: AttendanceStatus;
}

export enum NotificationCategory {
    ACADEMIC = 'Académica',
    INFORMATIVE = 'Informativa',
    URGENT = 'Urgente'
}

export interface Notification {
    id: string;
    title: string;
    description: string;
    category: NotificationCategory;
    date: string;
}

export interface Message {
    id: string;
    senderId: string;
    conversationId: string;
    text: string;
    timestamp: string;
    readBy: string[]; // List of user IDs who have read the message
}

export interface Conversation {
    id: string;
    isGroup: boolean;
    name?: string; // Only for groups
    participants: string[]; // array of user IDs
}

// Used for the list view of all chats
export interface ConversationListItem {
    id: string;
    name: string;
    isGroup: boolean;
    lastMessage?: Message;
}


export enum CalendarEventType {
    EXAM = 'Parcial',
    FINAL = 'Final',
    ENROLLMENT = 'Inscripción',
    INSTITUTIONAL = 'Acto Institucional',
    MEETING = 'Reunión'
}

export interface CalendarEvent {
    id: string;
    title: string;
    date: string;
    type: CalendarEventType;
    description: string;
}

export interface Note {
    id: string;
    userId: string;
    text: string;
    date: string;
    lastUpdated: string;
}

export enum SuggestionComplaintType {
    SUGGESTION = 'Sugerencia',
    COMPLAINT = 'Queja'
}

export enum SuggestionComplaintStatus {
    NEW = 'Nueva',
    READ = 'Leída',
    RESOLVED = 'Resuelta'
}

export interface SuggestionComplaint {
    id: string;
    userId: string;
    type: SuggestionComplaintType;
    text: string;
    date: string;
    status: SuggestionComplaintStatus;
}

// --- NEW TYPES FOR GRADES AND FINALS ---

export interface Grade {
    id: string;
    studentId: string;
    subjectId: string;
    evaluationType: string; // e.g., 'Parcial 1', 'TP Final'
    score: number;
}

export interface FinalExam {
    id: string;
    subjectId: string;
    subjectName: string;
    professorId: string;
    date: string;
    time: string;
    classroom: string;
    capacity: number;
}

export interface FinalEnrollment {
    finalId: string;
    studentId: string;
}
