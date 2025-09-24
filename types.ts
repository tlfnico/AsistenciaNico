export enum UserRole {
    STUDENT = 'student',
    PRECEPTOR = 'preceptor'
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
    receiverId: string;
    text: string;
    timestamp: string;
    readTimestamp: string | null;
}

export interface Conversation {
    id: string;
    participant: User;
    lastMessage: Message;
}

export enum CalendarEventType {
    EXAM = 'Parcial',
    FINAL = 'Final',
    ENROLLMENT = 'Inscripción',
    INSTITUTIONAL = 'Acto Institucional'
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
    lastUpdated: string;
}