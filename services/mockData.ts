import { Student, Preceptor, UserRole, AttendanceRecord, AttendanceStatus, Notification, NotificationCategory, Message, Conversation, CalendarEvent, CalendarEventType, User } from '../types';

export const students: Student[] = [
    { id: 's1', name: 'Juan Perez', email: 'juan.perez@email.com', role: UserRole.STUDENT, dni: '12345678', careers: ['Ingeniería en Sistemas', 'Licenciatura en Física'], year: 3 },
    { id: 's2', name: 'Maria Garcia', email: 'maria.garcia@email.com', role: UserRole.STUDENT, dni: '87654321', careers: ['Ingeniería en Sistemas'], year: 3 },
    { id: 's3', name: 'Carlos Lopez', email: 'carlos.lopez@email.com', role: UserRole.STUDENT, dni: '11223344', careers: ['Ingeniería Química'], year: 2 },
    { id: 's4', name: 'Lucia Fernandez', email: 'lucia.fernandez@email.com', role: UserRole.STUDENT, dni: '55667788', careers: ['Ingeniería en Sistemas'], year: 3 },
    { id: 's5', name: 'Pedro Rodriguez', email: 'pedro.rodriguez@email.com', role: UserRole.STUDENT, dni: '99887766', careers: ['Licenciatura en Administración'], year: 1 },
    { id: 's6', name: 'Ana Gomez', email: 'ana.gomez@email.com', role: UserRole.STUDENT, dni: '12312312', careers: ['Licenciatura en Administración'], year: 1 },
];

export const preceptors: Preceptor[] = [
    { id: 'p1', name: 'Laura Martinez', email: 'laura.martinez@email.com', role: UserRole.PRECEPTOR },
    { id: 'p2', name: 'Roberto Sanchez', email: 'roberto.sanchez@email.com', role: UserRole.PRECEPTOR },
    { id: 'p3', name: 'Marta Diaz', email: 'marta.diaz@email.com', role: UserRole.PRECEPTOR },
];

export const users: (Student | Preceptor)[] = [...students, ...preceptors];

export const subjectsByCareer: { [career: string]: string[] } = {
    'Ingeniería en Sistemas': ['Análisis Matemático III', 'Física II', 'Programación I', 'Sistemas Operativos', 'Base de Datos'],
    'Ingeniería Química': ['Química General', 'Química Orgánica'],
    'Licenciatura en Administración': ['Introducción a la Administración', 'Administración I'],
    'Licenciatura en Física': ['Física Cuántica I', 'Mecánica Clásica Avanzada']
};


export let attendanceRecords: AttendanceRecord[] = [
    // Juan Perez - Análisis Matemático III (Good Attendance)
    { id: 'a1', studentId: 's1', date: '2024-07-20', subject: 'Análisis Matemático III', status: AttendanceStatus.PRESENT },
    { id: 'a2', studentId: 's1', date: '2024-07-21', subject: 'Análisis Matemático III', status: AttendanceStatus.PRESENT },
    { id: 'a3', studentId: 's1', date: '2024-07-22', subject: 'Análisis Matemático III', status: AttendanceStatus.ABSENT },
    { id: 'a11', studentId: 's1', date: '2024-07-27', subject: 'Análisis Matemático III', status: AttendanceStatus.PRESENT },
    { id: 'a12', studentId: 's1', date: '2024-07-28', subject: 'Análisis Matemático III', status: AttendanceStatus.PRESENT },
    { id: 'a13', studentId: 's1', date: '2024-07-29', subject: 'Análisis Matemático III', status: AttendanceStatus.PRESENT },

    // Juan Perez - Física II (Low Attendance)
    { id: 'a14', studentId: 's1', date: '2024-07-19', subject: 'Física II', status: AttendanceStatus.ABSENT },
    { id: 'a15', studentId: 's1', date: '2024-07-20', subject: 'Física II', status: AttendanceStatus.PRESENT },
    { id: 'a16', studentId: 's1', date: '2024-07-26', subject: 'Física II', status: AttendanceStatus.ABSENT },
    { id: 'a17', studentId: 's1', date: '2024-07-27', subject: 'Física II', status: AttendanceStatus.LATE },
    { id: 'a18', studentId: 's1', date: '2024-08-02', subject: 'Física II', status: AttendanceStatus.ABSENT },
    { id: 'a19', studentId: 's1', date: '2024-08-03', subject: 'Física II', status: AttendanceStatus.PRESENT },
    { id: 'a20', studentId: 's1', date: '2024-08-09', subject: 'Física II', status: AttendanceStatus.ABSENT },
    { id: 'a21', studentId: 's1', date: '2024-08-10', subject: 'Física II', status: AttendanceStatus.ABSENT },

    // Juan Perez - Programación I (Perfect Attendance)
    { id: 'a22', studentId: 's1', date: '2024-07-18', subject: 'Programación I', status: AttendanceStatus.PRESENT },
    { id: 'a23', studentId: 's1', date: '2024-07-25', subject: 'Programación I', status: AttendanceStatus.PRESENT },
    { id: 'a24', studentId: 's1', date: '2024-08-01', subject: 'Programación I', status: AttendanceStatus.PRESENT },
    { id: 'a25', studentId: 's1', date: '2024-08-08', subject: 'Programación I', status: AttendanceStatus.LATE },
    { id: 'a26', studentId: 's1', date: '2024-08-15', subject: 'Programación I', status: AttendanceStatus.PRESENT },

    // Juan Perez - Física Cuántica I (New Career)
    { id: 'a27', studentId: 's1', date: '2024-07-19', subject: 'Física Cuántica I', status: AttendanceStatus.PRESENT },
    { id: 'a28', studentId: 's1', date: '2024-07-26', subject: 'Física Cuántica I', status: AttendanceStatus.PRESENT },
    { id: 'a29', studentId: 's1', date: '2024-08-02', subject: 'Física Cuántica I', status: AttendanceStatus.ABSENT },
    { id: 'a30', studentId: 's1', date: '2024-08-09', subject: 'Física Cuántica I', status: AttendanceStatus.PRESENT },


    // Other students
    { id: 'a4', studentId: 's2', date: '2024-07-20', subject: 'Análisis Matemático III', status: AttendanceStatus.LATE },
    { id: 'a5', studentId: 's2', date: '2024-07-21', subject: 'Análisis Matemático III', status: AttendanceStatus.PRESENT },
    { id: 'a6', studentId: 's2', date: '2024-07-22', subject: 'Análisis Matemático III', status: AttendanceStatus.PRESENT },
    { id: 'a7', studentId: 's3', date: '2024-07-22', subject: 'Química General', status: AttendanceStatus.PRESENT },
    { id: 'a8', studentId: 's4', date: '2024-07-22', subject: 'Análisis Matemático III', status: AttendanceStatus.PRESENT },
    { id: 'a9', studentId: 's5', date: '2024-07-22', subject: 'Introducción a la Administración', status: AttendanceStatus.ABSENT },
    { id: 'a10', studentId: 's6', date: '2024-07-22', subject: 'Introducción a la Administración', status: AttendanceStatus.LATE },
];

export let notifications: Notification[] = [
    { id: 'n5', title: 'URGENTE: Suspensión de Actividades', description: 'Por alerta meteorológica, se suspenden todas las actividades académicas y administrativas para el día de mañana, 24 de Julio.', category: NotificationCategory.URGENT, date: '2024-07-23' },
    { id: 'n1', title: 'Inscripción a Finales', description: 'Se abren las inscripciones para las mesas de examen final.', category: NotificationCategory.ACADEMIC, date: '2024-07-15' },
    { id: 'n2', title: 'Acto 9 de Julio', description: 'Invitamos a toda la comunidad al acto por el Día de la Independencia.', category: NotificationCategory.INFORMATIVE, date: '2024-07-01' },
    { id: 'n3', title: 'Cierre de la universidad', description: 'El día 25 de Julio la universidad permanecerá cerrada por desinfección.', category: NotificationCategory.INFORMATIVE, date: '2024-07-23' },
    { id: 'n4', title: 'Recordatorio: Encuesta Estudiantil', description: 'Recuerda completar la encuesta de fin de semestre antes del 1 de Agosto.', category: NotificationCategory.ACADEMIC, date: '2024-07-20' },
];

export let messages: Message[] = [
    // Juan Perez and Laura Martinez conversation
    { id: 'm1', senderId: 's1', receiverId: 'p1', text: 'Hola, quería consultar sobre mi última inasistencia.', timestamp: '2024-07-22T10:00:00Z', readTimestamp: '2024-07-22T10:01:00Z' },
    { id: 'm2', senderId: 'p1', receiverId: 's1', text: 'Hola Juan, fue en la clase de Análisis Matemático. ¿Necesitas el justificativo?', timestamp: '2024-07-22T10:05:00Z', readTimestamp: '2024-07-23T08:14:00Z' },
    { id: 'm6', senderId: 's1', receiverId: 'p1', text: 'Sí, por favor. Lo presentaré mañana. ¿Me podrías indicar los temas que se vieron en esa clase de Física II que falté?', timestamp: '2024-07-23T08:15:00Z', readTimestamp: '2024-07-23T08:18:00Z' },
    { id: 'm7', senderId: 'p1', receiverId: 's1', text: 'Claro, se vieron los capítulos 3 y 4. Te recomiendo pedirle los apuntes a un compañero. El justificativo te lo dejo en preceptoría.', timestamp: '2024-07-23T08:20:00Z', readTimestamp: null },

    // Maria Garcia and Laura Martinez conversation
    { id: 'm3', senderId: 's2', receiverId: 'p1', text: 'Buen día Laura. ¿Podrías confirmarme la fecha del próximo parcial de Análisis?', timestamp: '2024-07-21T09:00:00Z', readTimestamp: '2024-07-21T09:05:00Z' },
    { id: 'm8', senderId: 'p1', receiverId: 's2', text: 'Hola María, el parcial es el 5 de Agosto. Está agendado en el calendario de la app también.', timestamp: '2024-07-21T09:10:00Z', readTimestamp: '2024-07-21T09:11:00Z' },
    { id: 'm9', senderId: 's2', receiverId: 'p1', text: '¡Genial, muchas gracias!', timestamp: '2024-07-21T09:12:00Z', readTimestamp: null },


    // Carlos Lopez and Roberto Sanchez conversation
    { id: 'm4', senderId: 's3', receiverId: 'p2', text: 'Hola Roberto, ¿cómo estás?', timestamp: '2024-07-23T11:00:00Z', readTimestamp: '2024-07-23T11:00:30Z' },
    { id: 'm5', senderId: 'p2', receiverId: 's3', text: '¡Hola Carlos! Todo bien por aquí. ¿Necesitas algo?', timestamp: '2024-07-23T11:01:00Z', readTimestamp: null },
];

export let calendarEvents: CalendarEvent[] = [
    { id: 'ce1', title: 'Parcial de Física II', date: '2024-08-05', type: CalendarEventType.EXAM, description: 'Aula 305. Temas 1 a 4.' },
    { id: 'ce2', title: 'Final de Álgebra', date: '2024-08-12', type: CalendarEventType.FINAL, description: 'Inscripción previa requerida.' },
    { id: 'ce3', title: 'Inicio de Inscripciones 2do Semestre', date: '2024-08-01', type: CalendarEventType.ENROLLMENT, description: 'A través del sistema de autogestión.' },
    { id: 'ce4', title: 'Acto de Colación', date: '2024-08-20', type: CalendarEventType.INSTITUTIONAL, description: 'En el auditorio principal.' },
    { id: 'ce5', title: 'Feriado Nacional', date: '2024-08-17', type: CalendarEventType.INSTITUTIONAL, description: 'Conmemoración del Paso a la Inmortalidad del Gral. José de San Martín.' },
    { id: 'ce6', title: 'Parcial de Química Orgánica', date: '2024-09-02', type: CalendarEventType.EXAM, description: 'Aula 101. Temas 5 a 8.' },
    { id: 'ce7', title: 'Límite Entrega TPs', date: '2024-07-29', type: CalendarEventType.ENROLLMENT, description: 'Fecha límite para la entrega de todos los trabajos prácticos del primer semestre.' },
    { id: 'ce8', title: 'Charla: Intercambios', date: '2024-09-15', type: CalendarEventType.INSTITUTIONAL, description: 'Charla sobre programas de intercambio para el próximo año.' },
    { id: 'ce9', title: 'Parcial de Programación I', date: '2024-10-10', type: CalendarEventType.EXAM, description: 'Aula 201. Temas de la unidad 3 y 4.' },
    { id: 'ce10', title: 'Final de Inglés Técnico', date: '2024-10-25', type: CalendarEventType.FINAL, description: 'Requiere inscripción previa. Se rinde en el laboratorio de idiomas.' },
    { id: 'ce11', title: 'Recuperatorio Parcial Física I', date: '2024-07-30', type: CalendarEventType.EXAM, description: 'Aula 102. Solo para alumnos que desaprobaron el primer parcial.' },
    { id: 'ce12', title: 'Taller de Oratoria', date: '2024-08-08', type: CalendarEventType.INSTITUTIONAL, description: 'Taller opcional para mejorar habilidades de comunicación. Auditorio B.' },
    { id: 'ce13', title: 'Parcial de Administración I', date: '2024-08-22', type: CalendarEventType.EXAM, description: 'Aula 501. Temas de la unidad 1 a la 3.' },
    { id: 'ce14', title: 'Día del Estudiante', date: '2024-09-21', type: CalendarEventType.INSTITUTIONAL, description: 'Asueto académico. ¡Feliz día!' },
    { id: 'ce15', title: 'Final de Química General', date: '2024-09-27', type: CalendarEventType.FINAL, description: 'Mesa de examen especial. Requiere inscripción.' },
    { id: 'ce16', title: 'Semana de la Ingeniería', date: '2024-10-14', type: CalendarEventType.INSTITUTIONAL, description: 'Inicio de la semana de la ingeniería con charlas y talleres.' },
    { id: 'ce17', title: 'Parcial de Sistemas Operativos', date: '2024-10-18', type: CalendarEventType.EXAM, description: 'Laboratorio de computación 3. Traer notebook.' },
    { id: 'ce18', title: 'Parcial de Base de Datos', date: '2024-11-04', type: CalendarEventType.EXAM, description: 'Aula 205. Temas: SQL y Modelo Relacional.' },
    { id: 'ce19', title: 'Límite inscripción a finales Diciembre', date: '2024-11-15', type: CalendarEventType.ENROLLMENT, description: 'Fecha final para inscribirse a las mesas de Diciembre.' },
    { id: 'ce20', title: 'Final de Análisis Matemático III', date: '2024-11-29', type: CalendarEventType.FINAL, description: 'Primera fecha de finales. Aula Magna.' },
    { id: 'ce21', title: 'Feriado Puente Turístico', date: '2024-11-18', type: CalendarEventType.INSTITUTIONAL, description: 'No habrá actividades académicas.' },
    { id: 'ce22', title: 'Taller de Introducción a LaTeX', date: '2024-07-31', type: CalendarEventType.INSTITUTIONAL, description: 'Taller práctico para aprender a usar LaTeX para documentos académicos. Laboratorio 5.' },
    { id: 'ce23', title: 'Clase de Consulta para Parcial de Física II', date: '2024-08-02', type: CalendarEventType.INSTITUTIONAL, description: 'Clase de consulta con el profesor titular de cara al parcial. Aula 204.' },
    { id: 'ce24', title: 'Torneo Inter-facultades de Ajedrez', date: '2024-09-05', type: CalendarEventType.INSTITUTIONAL, description: 'Inscripciones abiertas en el centro de estudiantes. ¡Vení a representar a tu carrera!' },
    { id: 'ce25', title: 'Inscripción a Cursos de Idiomas', date: '2024-09-10', type: CalendarEventType.ENROLLMENT, description: 'Último día para inscribirse a los cursos de idiomas del segundo cuatrimestre.' },
    { id: 'ce26', title: 'Conferencia: El Futuro de la IA', date: '2024-10-03', type: CalendarEventType.INSTITUTIONAL, description: 'A cargo del Dr. Esteban Quito. Se requiere inscripción previa. Auditorio Principal.' },
    { id: 'ce100', title: '2do Parcial de Base de Datos', date: '2024-11-04', type: CalendarEventType.EXAM, description: 'Temas: SQL Avanzado y NoSQL.' },
    { id: 'ce101', title: 'Inscripción a Finales Diciembre', date: '2024-11-15', type: CalendarEventType.ENROLLMENT, description: 'Fecha límite para inscribirse a las mesas de Diciembre.' },
    { id: 'ce102', title: 'Feriado Puente Turístico', date: '2024-11-18', type: CalendarEventType.INSTITUTIONAL, description: 'No habrá actividades académicas.' },
    { id: 'ce103', title: 'Final de Análisis Matemático III', date: '2024-11-29', type: CalendarEventType.FINAL, description: 'Primera fecha de finales. Aula Magna.' },
    { id: 'ce104', title: 'Final de Programación I', date: '2024-12-05', type: CalendarEventType.FINAL, description: 'Mesa de Diciembre.' },
    { id: 'ce105', title: 'Final de Física II', date: '2024-12-12', type: CalendarEventType.FINAL, description: 'Mesa de Diciembre.' },
    { id: 'ce106', title: 'Cierre del Semestre', date: '2024-12-20', type: CalendarEventType.INSTITUTIONAL, description: 'Finalización de actividades académicas del segundo semestre.' },
    { id: 'ce200', title: 'Inscripción a Finales Febrero', date: '2025-02-03', type: CalendarEventType.ENROLLMENT, description: 'Inscripción para mesas de examen de Febrero/Marzo.' },
    { id: 'ce201', title: 'Final de Sistemas Operativos', date: '2025-02-17', type: CalendarEventType.FINAL, description: 'Mesa de Febrero.' },
    { id: 'ce202', title: 'Final de Química Orgánica', date: '2025-02-24', type: CalendarEventType.FINAL, description: 'Mesa de Febrero.' },
    { id: 'ce203', title: 'Inicio de Clases - 1er Semestre', date: '2025-03-10', type: CalendarEventType.INSTITUTIONAL, description: 'Comienzo del ciclo lectivo 2025.' },
    { id: 'ce204', title: 'Feriado: Día Nacional de la Memoria', date: '2025-03-24', type: CalendarEventType.INSTITUTIONAL, description: 'Feriado nacional.' },
    { id: 'ce205', title: 'Semana Santa', date: '2025-04-18', type: CalendarEventType.INSTITUTIONAL, description: 'Viernes Santo, no hay actividades.' },
    { id: 'ce206', title: '1er Parcial de Álgebra Lineal', date: '2025-05-05', type: CalendarEventType.EXAM, description: 'Aula 201.' },
    { id: 'ce207', title: 'Feriado: Día del Trabajador', date: '2025-05-01', type: CalendarEventType.INSTITUTIONAL, description: 'Feriado nacional.' },
    { id: 'ce208', title: 'Jornada de Investigación Científica', date: '2025-05-22', type: CalendarEventType.INSTITUTIONAL, description: 'Presentación de trabajos de investigación de alumnos y docentes.' },
    { id: 'ce209', title: '1er Parcial de Probabilidad y Estadística', date: '2025-06-02', type: CalendarEventType.EXAM, description: 'Temas 1 al 5.' },
    { id: 'ce210', title: 'Límite de inscripción a Finales Julio', date: '2025-06-27', type: CalendarEventType.ENROLLMENT, description: 'Fecha final para inscribirse a las mesas de Julio.' },
    { id: 'ce211', title: 'Receso Invernal', date: '2025-07-14', type: CalendarEventType.INSTITUTIONAL, description: 'Inicio del receso de invierno. Finaliza el 25/07.' },
    { id: 'ce212', title: 'Final de Álgebra Lineal', date: '2025-07-28', type: CalendarEventType.FINAL, description: 'Primera fecha de finales post-receso.' },
    { id: 'ce213', title: 'Inicio de Clases - 2do Semestre', date: '2025-08-11', type: CalendarEventType.INSTITUTIONAL, description: 'Comienzo de la segunda mitad del año.' },
    { id: 'ce214', title: 'Parcial de Física III', date: '2025-09-15', type: CalendarEventType.EXAM, description: 'Aula 404.' },
    { id: 'ce215', title: 'Día del Estudiante', date: '2025-09-21', type: CalendarEventType.INSTITUTIONAL, description: 'Asueto académico. ¡Feliz día!' },
    { id: 'ce216', title: 'Parcial de Termodinámica', date: '2025-10-20', type: CalendarEventType.EXAM, description: 'Temas de la unidad 1 y 2.' },
    { id: 'ce217', title: 'Jornada de Puertas Abiertas', date: '2025-11-08', type: CalendarEventType.INSTITUTIONAL, description: 'Invitamos a futuros estudiantes a conocer la universidad.' },
    { id: 'ce218', title: 'Límite inscripción a finales Diciembre', date: '2025-11-21', type: CalendarEventType.ENROLLMENT, description: 'Fecha final para inscribirse a las mesas de Diciembre 2025.' },
    { id: 'ce219', title: 'Final de Termodinámica', date: '2025-12-01', type: CalendarEventType.FINAL, description: 'Primera fecha de finales de Diciembre.' },
    { id: 'ce220', title: 'Acto de Colación 2025', date: '2025-12-19', type: CalendarEventType.INSTITUTIONAL, description: 'Ceremonia de graduación en el auditorio principal.' }
];


// Mock API functions
export const mockApiService = {
    login: (email: string): User | null => {
        return users.find(u => u.email === email) || null;
    },
    getStudentAttendance: (studentId: string): AttendanceRecord[] => {
        // If studentId is empty, return all records (for preceptor dashboard)
        if (!studentId) return attendanceRecords;
        return attendanceRecords.filter(a => a.studentId === studentId);
    },
    getStudentsByCareerAndYear: (career: string, year: number): Student[] => {
        return students.filter(s => s.careers.includes(career) && s.year === year);
    },
    saveAttendance: (records: { studentId: string, status: AttendanceStatus }[], subject: string, date: string) => {
        records.forEach(record => {
            const newRecord: AttendanceRecord = {
                id: `a${Date.now()}${Math.random()}`,
                ...record,
                subject,
                date,
            };
            attendanceRecords.push(newRecord);
        });
    },
    getNotifications: (): Notification[] => {
        return notifications.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    },
    addNotification: (notification: Omit<Notification, 'id' | 'date'>) => {
        const newNotification: Notification = {
            ...notification,
            id: `n${Date.now()}`,
            date: new Date().toISOString().split('T')[0]
        };
        notifications.unshift(newNotification);
    },
    getConversations: (userId: string): Conversation[] => {
        const userConversations: { [key: string]: Message } = {};
        messages
            .filter(m => m.senderId === userId || m.receiverId === userId)
            .forEach(m => {
                const otherParticipantId = m.senderId === userId ? m.receiverId : m.senderId;
                if (!userConversations[otherParticipantId] || new Date(m.timestamp) > new Date(userConversations[otherParticipantId].timestamp)) {
                    userConversations[otherParticipantId] = m;
                }
            });

        return Object.keys(userConversations).map(otherId => ({
            id: otherId,
            participant: users.find(u => u.id === otherId) as User,
            lastMessage: userConversations[otherId],
        })).sort((a, b) => new Date(b.lastMessage.timestamp).getTime() - new Date(a.lastMessage.timestamp).getTime());
    },
    getMessages: (userId1: string, userId2: string): Message[] => {
        return messages
            .filter(m => (m.senderId === userId1 && m.receiverId === userId2) || (m.senderId === userId2 && m.receiverId === userId1))
            .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    },
    sendMessage: (senderId: string, receiverId: string, text: string) => {
        const newMessage: Message = {
            id: `m${Date.now()}`,
            senderId,
            receiverId,
            text,
            timestamp: new Date().toISOString(),
            readTimestamp: null
        };
        messages.push(newMessage);
        return newMessage;
    },
    markMessagesAsRead: (readerId: string, senderId: string) => {
        messages.forEach(m => {
            if (m.receiverId === readerId && m.senderId === senderId && !m.readTimestamp) {
                m.readTimestamp = new Date().toISOString();
            }
        });
    },
    getCalendarEvents: (): CalendarEvent[] => {
        return calendarEvents.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    },
    addCalendarEvent: (event: Omit<CalendarEvent, 'id'>) => {
        const newEvent: CalendarEvent = {
            ...event,
            id: `ce${Date.now()}`
        };
        calendarEvents.push(newEvent);
    },
    updateCalendarEvent: (updatedEvent: CalendarEvent) => {
        const index = calendarEvents.findIndex(e => e.id === updatedEvent.id);
        if (index !== -1) {
            calendarEvents[index] = updatedEvent;
        }
    },
    deleteCalendarEvent: (eventId: string) => {
        calendarEvents = calendarEvents.filter(e => e.id !== eventId);
    },
};