import { Student, Preceptor, UserRole, AttendanceRecord, AttendanceStatus, Notification, NotificationCategory, Message, Conversation, CalendarEvent, CalendarEventType, User, Note, Admin, Career, Subject, SuggestionComplaint, SuggestionComplaintType, SuggestionComplaintStatus, Professor, ConversationListItem, Grade, FinalExam, FinalEnrollment } from '../types';

export const students: Student[] = [
    { id: 's1', name: 'Juan Perez', email: 'juan.perez@email.com', role: UserRole.STUDENT, dni: '12345678', careers: ['Ingeniería en Sistemas', 'Licenciatura en Física'], year: 3 },
    { id: 's2', name: 'Maria Garcia', email: 'maria.garcia@email.com', role: UserRole.STUDENT, dni: '87654321', careers: ['Ingeniería en Sistemas'], year: 3 },
    { id: 's3', name: 'Carlos Lopez', email: 'carlos.lopez@email.com', role: UserRole.STUDENT, dni: '11223344', careers: ['Ingeniería Química'], year: 2 },
    { id: 's4', name: 'Lucia Fernandez', email: 'lucia.fernandez@email.com', role: UserRole.STUDENT, dni: '55667788', careers: ['Ingeniería en Sistemas'], year: 3 },
    { id: 's5', name: 'Pedro Rodriguez', email: 'pedro.rodriguez@email.com', role: UserRole.STUDENT, dni: '99887766', careers: ['Licenciatura en Administración'], year: 1 },
    { id: 's6', name: 'Ana Gomez', email: 'ana.gomez@email.com', role: UserRole.STUDENT, dni: '12312312', careers: ['Licenciatura en Administración'], year: 1 },
    // More students for testing
    { id: 's7', name: 'Laura Torres', email: 'laura.torres@email.com', role: UserRole.STUDENT, dni: '23456789', careers: ['Ingeniería en Sistemas'], year: 3 },
    { id: 's8', name: 'Marcos Vega', email: 'marcos.vega@email.com', role: UserRole.STUDENT, dni: '34567890', careers: ['Ingeniería en Sistemas'], year: 3 },
    { id: 's9', name: 'Sofia Castro', email: 'sofia.castro@email.com', role: UserRole.STUDENT, dni: '45678901', careers: ['Ingeniería Química'], year: 2 },
    { id: 's10', name: 'David Romero', email: 'david.romero@email.com', role: UserRole.STUDENT, dni: '56789012', careers: ['Ingeniería Química'], year: 2 },
    { id: 's11', name: 'Paula Nuñez', email: 'paula.nunez@email.com', role: UserRole.STUDENT, dni: '67890123', careers: ['Ingeniería Química'], year: 2 },
    { id: 's12', name: 'Martin Suarez', email: 'martin.suarez@email.com', role: UserRole.STUDENT, dni: '78901234', careers: ['Licenciatura en Administración'], year: 1 },
    { id: 's13', name: 'Valentina Rojas', email: 'valentina.rojas@email.com', role: UserRole.STUDENT, dni: '89012345', careers: ['Licenciatura en Administración'], year: 1 },
    { id: 's14', name: 'Diego Medina', email: 'diego.medina@email.com', role: UserRole.STUDENT, dni: '90123456', careers: ['Licenciatura en Administración'], year: 1 },
    { id: 's15', name: 'Camila Rios', email: 'camila.rios@email.com', role: UserRole.STUDENT, dni: '11122233', careers: ['Ingeniería en Sistemas'], year: 2 },
    { id: 's16', name: 'Bruno Acosta', email: 'bruno.acosta@email.com', role: UserRole.STUDENT, dni: '22233344', careers: ['Ingeniería en Sistemas'], year: 2 },
    { id: 's17', name: 'Valeria Benitez', email: 'valeria.benitez@email.com', role: UserRole.STUDENT, dni: '33344455', careers: ['Ingeniería en Sistemas'], year: 1 },
    { id: 's18', name: 'Nicolas Gimenez', email: 'nicolas.gimenez@email.com', role: UserRole.STUDENT, dni: '44455566', careers: ['Ingeniería en Sistemas'], year: 1 },
    { id: 's19', name: 'Julieta Vazquez', email: 'julieta.vazquez@email.com', role: UserRole.STUDENT, dni: '55566677', careers: ['Ingeniería en Sistemas'], year: 1 },
    { id: 's20', name: 'Mateo Castillo', email: 'mateo.castillo@email.com', role: UserRole.STUDENT, dni: '66677788', careers: ['Ingeniería en Sistemas'], year: 2 },
    { id: 's21', name: 'Isabella Morales', email: 'isabella.morales@email.com', role: UserRole.STUDENT, dni: '77788899', careers: ['Ingeniería Química'], year: 1 },
    { id: 's22', name: 'Santiago Molina', email: 'santiago.molina@email.com', role: UserRole.STUDENT, dni: '88899900', careers: ['Ingeniería Química'], year: 1 },
    { id: 's23', name: 'Renata Ortega', email: 'renata.ortega@email.com', role: UserRole.STUDENT, dni: '99900011', careers: ['Licenciatura en Administración'], year: 2 },
    { id: 's24', name: 'Lucas Paredes', email: 'lucas.paredes@email.com', role: UserRole.STUDENT, dni: '00011122', careers: ['Licenciatura en Física'], year: 3 },
];

export const preceptors: Preceptor[] = [
    { id: 'p1', name: 'Laura Martinez', email: 'laura.martinez@email.com', role: UserRole.PRECEPTOR },
    { id: 'p2', name: 'Roberto Sanchez', email: 'roberto.sanchez@email.com', role: UserRole.PRECEPTOR },
    { id: 'p3', name: 'Marta Diaz', email: 'marta.diaz@email.com', role: UserRole.PRECEPTOR },
];

export const professors: Professor[] = [
    { id: 'prof1', name: 'Dr. Alan Turing', email: 'alan.turing@email.com', role: UserRole.PROFESSOR, subjects: ['s1-3', 's1-4'] },
    { id: 'prof2', name: 'Dra. Ada Lovelace', email: 'ada.lovelace@email.com', role: UserRole.PROFESSOR, subjects: ['s1-1', 's1-5'] },
    { id: 'prof3', name: 'Dr. Albert Einstein', email: 'albert.einstein@email.com', role: UserRole.PROFESSOR, subjects: ['s1-6', 's4-1', 's4-2', 's4-3'] },
    { id: 'prof4', name: 'Dra. Marie Curie', email: 'marie.curie@email.com', role: UserRole.PROFESSOR, subjects: ['s2-1', 's2-2'] },
    { id: 'prof5', name: 'Dr. Peter Drucker', email: 'peter.drucker@email.com', role: UserRole.PROFESSOR, subjects: ['s3-1', 's3-2', 's3-3'] },
];

export const admins: Admin[] = [
    { id: 'adm1', name: 'Admin General', email: 'admin@email.com', role: UserRole.ADMIN },
];

export let users: (Student | Preceptor | Admin | Professor)[] = [...students, ...preceptors, ...admins, ...professors];

export let careers: Career[] = [
    { 
        id: 'c1', 
        name: 'Ingeniería en Sistemas', 
        subjects: [
            { id: 's1-1', name: 'Programación I', year: 1, professorId: 'prof2' },
            { id: 's1-2', name: 'Análisis Matemático I', year: 1 },
            { id: 's1-3', name: 'Sistemas Operativos', year: 2, professorId: 'prof1' },
            { id: 's1-4', name: 'Base de Datos', year: 2, professorId: 'prof1' },
            { id: 's1-5', name: 'Análisis Matemático III', year: 3, professorId: 'prof2' },
            { id: 's1-6', name: 'Física II', year: 3, professorId: 'prof3' },
        ] 
    },
    { 
        id: 'c2', 
        name: 'Ingeniería Química', 
        subjects: [
            { id: 's2-1', name: 'Química General', year: 1, professorId: 'prof4' },
            { id: 's2-2', name: 'Química Orgánica', year: 2, professorId: 'prof4' },
        ] 
    },
    { 
        id: 'c3', 
        name: 'Licenciatura en Administración', 
        subjects: [
            { id: 's3-1', name: 'Introducción a la Administración', year: 1, professorId: 'prof5' },
            { id: 's3-2', name: 'Administración I', year: 1, professorId: 'prof5' },
            { id: 's3-3', name: 'Contabilidad', year: 2, professorId: 'prof5'},
        ] 
    },
    { 
        id: 'c4', 
        name: 'Licenciatura en Física', 
        subjects: [
            { id: 's4-1', name: 'Física I', year: 1, professorId: 'prof3' },
            { id: 's4-2', name: 'Física Cuántica I', year: 3, professorId: 'prof3' },
            { id: 's4-3', name: 'Mecánica Clásica Avanzada', year: 3, professorId: 'prof3' },
        ] 
    }
];

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
    
    // Attendance for new students
    // Laura Torres (s7) - Análisis Matemático III
    { id: 'a31', studentId: 's7', date: '2024-07-20', subject: 'Análisis Matemático III', status: AttendanceStatus.PRESENT },
    { id: 'a32', studentId: 's7', date: '2024-07-21', subject: 'Análisis Matemático III', status: AttendanceStatus.PRESENT },
    { id: 'a33', studentId: 's7', date: '2024-07-22', subject: 'Análisis Matemático III', status: AttendanceStatus.PRESENT },
    
    // Sofia Castro (s9) - Química General
    { id: 'a34', studentId: 's9', date: '2024-07-22', subject: 'Química General', status: AttendanceStatus.ABSENT },
    { id: 'a35', studentId: 's9', date: '2024-07-29', subject: 'Química General', status: AttendanceStatus.PRESENT },
    
    // David Romero (s10) - Química General
    { id: 'a36', studentId: 's10', date: '2024-07-22', subject: 'Química General', status: AttendanceStatus.PRESENT },
    { id: 'a37', studentId: 's10', date: '2024-07-29', subject: 'Química General', status: AttendanceStatus.LATE },

    // Martin Suarez (s12) - Introducción a la Administración
    { id: 'a38', studentId: 's12', date: '2024-07-22', subject: 'Introducción a la Administración', status: AttendanceStatus.PRESENT },
    { id: 'a39', studentId: 's12', date: '2024-07-29', subject: 'Introducción a la Administración', status: AttendanceStatus.PRESENT },

    // Camila Rios (s15) - Sistemas Operativos
    { id: 'a40', studentId: 's15', date: '2024-08-01', subject: 'Sistemas Operativos', status: AttendanceStatus.PRESENT },
    { id: 'a41', studentId: 's15', date: '2024-08-08', subject: 'Sistemas Operativos', status: AttendanceStatus.ABSENT },
    
    // Valeria Benitez (s17) - Programación I
    { id: 'a42', studentId: 's17', date: '2024-07-18', subject: 'Programación I', status: AttendanceStatus.LATE },
    { id: 'a43', studentId: 's17', date: '2024-07-25', subject: 'Programación I', status: AttendanceStatus.PRESENT },

    // Attendance for newly added students
    // Julieta Vazquez (s19) - Programación I
    { id: 'a44', studentId: 's19', date: '2024-07-25', subject: 'Programación I', status: AttendanceStatus.PRESENT },
    { id: 'a45', studentId: 's19', date: '2024-08-01', subject: 'Programación I', status: AttendanceStatus.PRESENT },

    // Mateo Castillo (s20) - Sistemas Operativos
    { id: 'a46', studentId: 's20', date: '2024-08-01', subject: 'Sistemas Operativos', status: AttendanceStatus.LATE },
    { id: 'a47', studentId: 's20', date: '2024-08-08', subject: 'Sistemas Operativos', status: AttendanceStatus.PRESENT },

    // Isabella Morales (s21) - Química General
    { id: 'a48', studentId: 's21', date: '2024-07-22', subject: 'Química General', status: AttendanceStatus.PRESENT },
    { id: 'a49', studentId: 's21', date: '2024-07-29', subject: 'Química General', status: AttendanceStatus.ABSENT },

    // Santiago Molina (s22) - Química General
    { id: 'a50', studentId: 's22', date: '2024-07-22', subject: 'Química General', status: AttendanceStatus.PRESENT },
    { id: 'a51', studentId: 's22', date: '2024-07-29', subject: 'Química General', status: AttendanceStatus.PRESENT },

    // Renata Ortega (s23) - Administración I
    { id: 'a52', studentId: 's23', date: '2024-08-05', subject: 'Administración I', status: AttendanceStatus.PRESENT },
    { id: 'a53', studentId: 's23', date: '2024-08-12', subject: 'Administración I', status: AttendanceStatus.ABSENT },

    // Lucas Paredes (s24) - Física Cuántica I
    { id: 'a54', studentId: 's24', date: '2024-08-02', subject: 'Física Cuántica I', status: AttendanceStatus.PRESENT },
    { id: 'a55', studentId: 's24', date: '2024-08-09', subject: 'Física Cuántica I', status: AttendanceStatus.LATE },
];

export let notifications: Notification[] = [
    { id: 'n5', title: 'URGENTE: Suspensión de Actividades', description: 'Por alerta meteorológica, se suspenden todas las actividades académicas y administrativas para el día de mañana, 24 de Julio.', category: NotificationCategory.URGENT, date: '2024-07-23' },
    { id: 'n1', title: 'Inscripción a Finales', description: 'Se abren las inscripciones para las mesas de examen final.', category: NotificationCategory.ACADEMIC, date: '2024-07-15' },
    { id: 'n2', title: 'Acto 9 de Julio', description: 'Invitamos a toda la comunidad al acto por el Día de la Independencia.', category: NotificationCategory.INFORMATIVE, date: '2024-07-01' },
    { id: 'n3', title: 'Cierre de la universidad', description: 'El día 25 de Julio la universidad permanecerá cerrada por desinfección.', category: NotificationCategory.INFORMATIVE, date: '2024-07-23' },
    { id: 'n4', title: 'Recordatorio: Encuesta Estudiantil', description: 'Recuerda completar la encuesta de fin de semestre antes del 1 de Agosto.', category: NotificationCategory.ACADEMIC, date: '2024-07-20' },
];

export let conversations: Conversation[] = [
    // 1-on-1 conversations
    { id: 's1-p1', isGroup: false, participants: ['s1', 'p1'] },
    { id: 's2-p1', isGroup: false, participants: ['s2', 'p1'] },
    { id: 's3-p2', isGroup: false, participants: ['s3', 'p2'] },
    // Group conversations
    { id: 'g1', isGroup: true, name: 'Proyecto Final - Base de Datos', participants: ['s1', 's2', 's4', 'prof1'] },
    { id: 'g2', isGroup: true, name: 'Preceptores', participants: ['p1', 'p2', 'p3'] },
];

export let messages: Message[] = [
    // Juan Perez and Laura Martinez conversation (s1-p1)
    { id: 'm1', senderId: 's1', conversationId: 's1-p1', text: 'Hola, quería consultar sobre mi última inasistencia.', timestamp: '2024-07-22T10:00:00Z', readBy: ['s1', 'p1'] },
    { id: 'm2', senderId: 'p1', conversationId: 's1-p1', text: 'Hola Juan, fue en la clase de Análisis Matemático. ¿Necesitas el justificativo?', timestamp: '2024-07-22T10:05:00Z', readBy: ['s1', 'p1'] },
    { id: 'm6', senderId: 's1', conversationId: 's1-p1', text: 'Sí, por favor. Lo presentaré mañana. ¿Me podrías indicar los temas que se vieron en esa clase de Física II que falté?', timestamp: '2024-07-23T08:15:00Z', readBy: ['s1', 'p1'] },
    { id: 'm7', senderId: 'p1', conversationId: 's1-p1', text: 'Claro, se vieron los capítulos 3 y 4. Te recomiendo pedirle los apuntes a un compañero. El justificativo te lo dejo en preceptoría.', timestamp: '2024-07-23T08:20:00Z', readBy: ['s1'] },

    // Maria Garcia and Laura Martinez conversation (s2-p1)
    { id: 'm3', senderId: 's2', conversationId: 's2-p1', text: 'Buen día Laura. ¿Podrías confirmarme la fecha del próximo parcial de Análisis?', timestamp: '2024-07-21T09:00:00Z', readBy: ['s2', 'p1'] },
    { id: 'm8', senderId: 'p1', conversationId: 's2-p1', text: 'Hola María, el parcial es el 5 de Agosto. Está agendado en el calendario de la app también.', timestamp: '2024-07-21T09:10:00Z', readBy: ['s2', 'p1'] },
    { id: 'm9', senderId: 's2', conversationId: 's2-p1', text: '¡Genial, muchas gracias!', timestamp: '2024-07-21T09:12:00Z', readBy: ['s2'] },

    // Carlos Lopez and Roberto Sanchez conversation (s3-p2)
    { id: 'm4', senderId: 's3', conversationId: 's3-p2', text: 'Hola Roberto, ¿cómo estás?', timestamp: '2024-07-23T11:00:00Z', readBy: ['s3', 'p2'] },
    { id: 'm5', senderId: 'p2', conversationId: 's3-p2', text: '¡Hola Carlos! Todo bien por aquí. ¿Necesitas algo?', timestamp: '2024-07-23T11:01:00Z', readBy: ['s3'] },

    // Group messages for g1
    { id: 'gm1', senderId: 'prof1', conversationId: 'g1', text: 'Hola equipo, ¿cómo van con el avance del proyecto final?', timestamp: '2024-07-23T14:00:00Z', readBy: ['s1', 's4', 'prof1'] },
    { id: 'gm2', senderId: 's1', conversationId: 'g1', text: 'Hola profe! Yo estoy terminando la sección del DER.', timestamp: '2024-07-23T14:02:00Z', readBy: ['s1', 's4', 'prof1'] },
    { id: 'gm3', senderId: 's2', conversationId: 'g1', text: 'Yo tengo algunas dudas con las consultas SQL, ¿podemos hacer una reunión?', timestamp: '2024-07-23T14:03:00Z', readBy: ['s2', 'prof1'] },
    { id: 'gm4', senderId: 'prof1', conversationId: 'g1', text: 'Claro María, mañana a las 10hs les parece bien?', timestamp: '2024-07-23T14:05:00Z', readBy: ['prof1'] },

    // Group messages for g2
    { id: 'gm5', senderId: 'p1', conversationId: 'g2', text: 'Colegas, recuerden que el viernes es el cierre de actas.', timestamp: '2024-07-24T09:00:00Z', readBy: ['p1', 'p2'] },
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

export let notes: Note[] = [
    { id: 'note1', userId: 's1', text: 'Estudiar para el parcial de Física II, temas 1 a 4.', date: '2024-08-04', lastUpdated: '2024-07-28T10:00:00Z' },
    { id: 'note2', userId: 's1', text: 'Recordar pedir el justificativo de inasistencia en preceptoría.', date: '2024-07-30', lastUpdated: '2024-07-27T15:30:00Z' },
    { id: 'note3', userId: 'p1', text: 'Preparar listados para las mesas de examen de Agosto.', date: '2024-08-01', lastUpdated: '2024-07-29T09:00:00Z' },
    { id: 'note4', userId: 'p1', text: 'Contactar a los alumnos con bajo rendimiento en Física II.', date: '2024-08-05', lastUpdated: '2024-07-29T11:00:00Z' },
];

export let suggestionsComplaints: SuggestionComplaint[] = [
    { id: 'sc1', userId: 's1', type: SuggestionComplaintType.COMPLAINT, text: 'El proyector del aula 205 no funciona correctamente, la imagen se ve muy oscura.', date: '2024-07-28', status: SuggestionComplaintStatus.NEW },
    { id: 'sc2', userId: 'p1', type: SuggestionComplaintType.SUGGESTION, text: 'Sería útil tener una función para exportar las listas de asistencia a un archivo CSV.', date: '2024-07-27', status: SuggestionComplaintStatus.READ },
    { id: 'sc3', userId: 's2', type: SuggestionComplaintType.SUGGESTION, text: 'Podrían agregar mapas de la universidad en la app para los nuevos estudiantes.', date: '2024-07-25', status: SuggestionComplaintStatus.RESOLVED },
];

// --- NEW DATA FOR GRADES AND FINALS ---
export let grades: Grade[] = [
    { id: 'grd1', studentId: 's1', subjectId: 's1-5', evaluationType: 'Parcial 1', score: 8 },
    { id: 'grd2', studentId: 's1', subjectId: 's1-5', evaluationType: 'TP 1', score: 9 },
    { id: 'grd3', studentId: 's2', subjectId: 's1-5', evaluationType: 'Parcial 1', score: 6 },
    { id: 'grd4', studentId: 's1', subjectId: 's1-6', evaluationType: 'Parcial 1', score: 3 },
    { id: 'grd5', studentId: 's17', subjectId: 's1-1', evaluationType: 'Parcial 1', score: 7 },
    { id: 'grd6', studentId: 's18', subjectId: 's1-1', evaluationType: 'Parcial 1', score: 4 },
];

export let finalExams: FinalExam[] = [
    { id: 'fin1', subjectId: 's1-5', subjectName: 'Análisis Matemático III', professorId: 'prof2', date: '2024-11-29', time: '09:00', classroom: 'Aula Magna', capacity: 50 },
    { id: 'fin2', subjectId: 's1-6', subjectName: 'Física II', professorId: 'prof3', date: '2024-12-12', time: '14:00', classroom: '305', capacity: 30 },
    { id: 'fin3', subjectId: 's1-1', subjectName: 'Programación I', professorId: 'prof2', date: '2024-12-05', time: '09:00', classroom: 'Lab 1', capacity: 25 },
];

export let finalEnrollments: FinalEnrollment[] = [
    { finalId: 'fin3', studentId: 's1' },
];

// Fix: Added mockApiService to provide mock data interactions.
export const mockApiService = {
    // Careers & Subjects
    getCareers: () => careers,
    getSubjectsForCareer: (careerName: string) => careers.find(c => c.name === careerName)?.subjects.map(s => s.name) || [],
    addCareer: (career: { name: string, subjects: Subject[] }) => {
        const newCareer = { ...career, id: `c${Date.now()}` };
        careers.push(newCareer);
    },
    updateCareer: (updatedCareer: Career) => {
        const index = careers.findIndex(c => c.id === updatedCareer.id);
        if (index !== -1) careers[index] = updatedCareer;
    },
    deleteCareer: (careerId: string) => {
        careers = careers.filter(c => c.id !== careerId);
    },
    getSubjectsByProfessor: (professorId: string): (Subject & { careerName: string })[] => {
        const professor = professors.find(p => p.id === professorId);
        if (!professor) return [];
        const subjectsWithCareer = careers.flatMap(c => c.subjects.map(s => ({ ...s, careerName: c.name })));
        return subjectsWithCareer.filter(s => professor.subjects.includes(s.id));
    },

    // Users
    getAllUsers: () => users,
    addUser: (user: Omit<User, 'id'>) => {
        const newUser = { ...user, id: `${user.role[0]}${Date.now()}` };
        users.push(newUser as User);
    },
    updateUser: (updatedUser: User) => {
        const index = users.findIndex(u => u.id === updatedUser.id);
        if (index !== -1) users[index] = { ...users[index], ...updatedUser };
    },
    deleteUser: (userId: string) => {
        users = users.filter(u => u.id !== userId);
    },

    // Students
    getStudentsByCareerAndYear: (careerName: string, year: number) => {
        return students.filter(s => s.year === year && s.careers.includes(careerName));
    },
    getStudentsBySubject: (subjectName: string) => {
        const subject = careers.flatMap(c => c.subjects).find(s => s.name === subjectName);
        if (!subject) return [];
        const career = careers.find(c => c.subjects.some(s => s.id === subject.id));
        if (!career) return [];
        return students.filter(s => s.year === subject.year && s.careers.includes(career.name));
    },
    getStudentsBySubjectId: (subjectId: string) => {
        const subject = careers.flatMap(c => c.subjects).find(s => s.id === subjectId);
        if (!subject) return [];
        const career = careers.find(c => c.subjects.some(s => s.id === subject.id));
        if (!career) return [];
        return students.filter(s => s.year === subject.year && s.careers.includes(career.name));
    },

    // Attendance
    getStudentAttendance: (studentId: string) => attendanceRecords.filter(r => r.studentId === studentId),
    getMonthlyAttendanceForClass: (studentIds: string[], subject: string, year: number, month: number) => {
        return attendanceRecords.filter(r => {
            const recordDate = new Date(r.date + 'T00:00:00Z');
            return studentIds.includes(r.studentId) &&
                r.subject === subject &&
                recordDate.getUTCFullYear() === year &&
                recordDate.getUTCMonth() === month;
        });
    },
    saveAttendance: (records: { studentId: string, status: AttendanceStatus }[], subject: string, date: string) => {
        records.forEach(record => {
            const existingIndex = attendanceRecords.findIndex(r => r.studentId === record.studentId && r.date === date && r.subject === subject);
            if (existingIndex !== -1) {
                attendanceRecords[existingIndex].status = record.status;
            } else {
                attendanceRecords.push({ id: `a${Date.now()}${Math.random()}`, studentId: record.studentId, date, subject, status: record.status });
            }
        });
    },

    // Notifications
    getNotifications: () => [...notifications].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    addNotification: (notification: Omit<Notification, 'id' | 'date'>) => {
        const newNotif = { ...notification, id: `n${Date.now()}`, date: new Date().toISOString().split('T')[0] };
        notifications.unshift(newNotif);
    },

    // Chat
    getConversations: (userId: string): ConversationListItem[] => {
        return conversations
            .filter(c => c.participants.includes(userId))
            .map(c => {
                const lastMessage = messages
                    .filter(m => m.conversationId === c.id)
                    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
                
                let name = c.name || '';
                if (!c.isGroup) {
                    const otherUserId = c.participants.find(p => p !== userId);
                    const otherUser = users.find(u => u.id === otherUserId);
                    name = otherUser?.name || 'Chat';
                }

                return { id: c.id, name, isGroup: c.isGroup, lastMessage };
            })
            .sort((a, b) => {
                if (!a.lastMessage) return 1;
                if (!b.lastMessage) return -1;
                return new Date(b.lastMessage.timestamp).getTime() - new Date(a.lastMessage.timestamp).getTime();
            });
    },
    getOrCreateConversation: (userId1: string, userId2: string) => {
        const sortedIds = [userId1, userId2].sort();
        const existing = conversations.find(c => !c.isGroup && c.participants.sort().join('-') === sortedIds.join('-'));
        if (existing) return existing;
        const newConvo = { id: sortedIds.join('-'), isGroup: false, participants: sortedIds };
        conversations.push(newConvo);
        return newConvo;
    },
    getOrCreateSubjectGroup: (subjectId: string, subjectName: string, professorId: string): Conversation => {
        const groupId = `group-subject-${subjectId}`;
        let group = conversations.find(c => c.id === groupId);
        if (group) return group;

        const studentsInSubject = mockApiService.getStudentsBySubjectId(subjectId);
        const participantIds = [professorId, ...studentsInSubject.map(s => s.id)];
        
        group = { id: groupId, isGroup: true, name: `Grupo: ${subjectName}`, participants: participantIds };
        conversations.push(group);
        return group;
    },

    // Calendar
    getCalendarEvents: () => calendarEvents,
    addCalendarEvent: (event: Omit<CalendarEvent, 'id'>) => {
        const newEvent = { ...event, id: `ce${Date.now()}` };
        calendarEvents.push(newEvent);
    },
    updateCalendarEvent: (updatedEvent: CalendarEvent) => {
        const index = calendarEvents.findIndex(e => e.id === updatedEvent.id);
        if (index !== -1) calendarEvents[index] = updatedEvent;
    },
    deleteCalendarEvent: (eventId: string) => {
        calendarEvents = calendarEvents.filter(e => e.id !== eventId);
    },
    
    // Suggestions
    getSuggestionsComplaints: () => suggestionsComplaints,
    addSuggestionComplaint: (s: { userId: string, type: SuggestionComplaintType, text: string }) => {
        const newSuggestion = { ...s, id: `sc${Date.now()}`, date: new Date().toISOString().split('T')[0], status: SuggestionComplaintStatus.NEW };
        suggestionsComplaints.unshift(newSuggestion);
    },
    updateSuggestionComplaintStatus: (id: string, status: SuggestionComplaintStatus) => {
        const suggestion = suggestionsComplaints.find(s => s.id === id);
        if (suggestion) suggestion.status = status;
    },

    // Grades
    getGradesForStudent: (studentId: string) => grades.filter(g => g.studentId === studentId),
    getGradesBySubject: (subjectId: string) => grades.filter(g => g.subjectId === subjectId),
    addOrUpdateGrade: (grade: Partial<Grade>) => {
        if (grade.id) {
            const index = grades.findIndex(g => g.id === grade.id);
            if (index !== -1) grades[index] = { ...grades[index], ...grade };
        } else {
            grades.push({ id: `grd${Date.now()}`, ...grade } as Grade);
        }
    },

    // Finals
    getFinalsByProfessor: (professorId: string) => finalExams.filter(f => f.professorId === professorId),
    createFinal: (finalData: Omit<FinalExam, 'id'>) => {
        const newFinal = { ...finalData, id: `fin${Date.now()}` };
        finalExams.push(newFinal);
    },
    deleteFinal: (finalId: string) => {
        finalExams = finalExams.filter(f => f.id !== finalId);
        finalEnrollments = finalEnrollments.filter(e => e.finalId !== finalId);
    },
    getAvailableFinalsForStudent: (student: Student) => {
        const studentSubjectIds = careers
            .filter(c => student.careers.includes(c.name))
            .flatMap(c => c.subjects)
            .filter(s => s.year <= student.year)
            .map(s => s.id);
        const enrolledIds = new Set(finalEnrollments.filter(e => e.studentId === student.id).map(e => e.finalId));
        return finalExams.filter(f => studentSubjectIds.includes(f.subjectId) && !enrolledIds.has(f.id));
    },
    getStudentEnrollments: (studentId: string) => {
        const enrolledIds = new Set(finalEnrollments.filter(e => e.studentId === studentId).map(e => e.finalId));
        return finalExams.filter(f => enrolledIds.has(f.id));
    },
    enrollInFinal: (studentId: string, finalId: string) => {
        const alreadyEnrolled = finalEnrollments.some(e => e.studentId === studentId && e.finalId === finalId);
        if (alreadyEnrolled) return false;
        finalEnrollments.push({ studentId, finalId });
        return true;
    },
    withdrawFromFinal: (studentId: string, finalId: string) => {
        finalEnrollments = finalEnrollments.filter(e => !(e.studentId === studentId && e.finalId === finalId));
    },
    getEnrolledStudentsForFinal: (finalId: string) => {
        const studentIds = new Set(finalEnrollments.filter(e => e.finalId === finalId).map(e => e.studentId));
        return students.filter(s => studentIds.has(s.id));
    }
};
