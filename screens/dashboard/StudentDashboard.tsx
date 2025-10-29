import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Card from '../../components/common/Card';
import * as api from '../../services/api';
import { AttendanceStatus, Notification, NotificationCategory, SuggestionComplaintType } from '../../types';
import Icon from '../../components/common/Icon';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';

const getCategoryClasses = (category: NotificationCategory) => {
    switch(category) {
        case NotificationCategory.ACADEMIC: return { border: 'border-blue-500', text: 'text-blue-600', bg: 'bg-blue-50' };
        case NotificationCategory.INFORMATIVE: return { border: 'border-green-500', text: 'text-green-600', bg: 'bg-green-50' };
        case NotificationCategory.URGENT: return { border: 'border-red-600', text: 'text-red-600', bg: 'bg-red-50' };
        default: return { border: 'border-gray-500', text: 'text-gray-600', bg: 'bg-gray-50'};
    }
}

const FeedbackCard: React.FC = () => {
    const { user } = useAuth();
    const [type, setType] = useState<SuggestionComplaintType>(SuggestionComplaintType.SUGGESTION);
    const [text, setText] = useState('');
    const [feedback, setFeedback] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim() || !user) return;
        
        // This function would need to be implemented in api.ts
        // await api.addSuggestionComplaint({ userId: user.id, type, text });
        console.log("Feedback submitted (not implemented in API yet)");
        
        setFeedback('¡Gracias por tu opinión!');
        setText('');
        setTimeout(() => setFeedback(''), 3000);
    };

    return (
        <Card>
            <div className="flex items-center gap-3 mb-4">
                <Icon name="chat" className="w-8 h-8 text-brand-primary" />
                <h2 className="text-xl font-bold text-brand-text">¿Sugerencias o Quejas?</h2>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
                <textarea 
                    value={text} 
                    onChange={e => setText(e.target.value)}
                    placeholder="Escribe tu mensaje aquí..."
                    rows={4}
                    className="w-full border-gray-300 rounded-md shadow-sm p-2"
                    required
                />
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                    <select value={type} onChange={e => setType(e.target.value as SuggestionComplaintType)} className="border-gray-300 rounded-md shadow-sm p-2">
                        <option value={SuggestionComplaintType.SUGGESTION}>Sugerencia</option>
                        <option value={SuggestionComplaintType.COMPLAINT}>Queja</option>
                    </select>
                    <Button type="submit">Enviar</Button>
                </div>
                 {feedback && <p className="text-green-600 font-semibold text-right">{feedback}</p>}
            </form>
        </Card>
    );
};

const StudentDashboard: React.FC = () => {
    const { user } = useAuth();
    const [attendancePercentage, setAttendancePercentage] = useState(0);
    const [latestNotification, setLatestNotification] = useState<Notification | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;
            setLoading(true);
            try {
                const [attendanceRecords, notifications] = await Promise.all([
                    api.getStudentAttendance(user.id),
                    api.getNotifications()
                ]);

                const totalClasses = attendanceRecords.length;
                const presentOrLate = attendanceRecords.filter(r => r.status === AttendanceStatus.PRESENT || r.status === AttendanceStatus.LATE).length;
                setAttendancePercentage(totalClasses > 0 ? Math.round((presentOrLate / totalClasses) * 100) : 100);

                setLatestNotification(notifications[0] || null);

            } catch (error) {
                console.error("Failed to load dashboard data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user]);
    
    let percentageColor = 'text-green-600';
    if (attendancePercentage < 75) percentageColor = 'text-yellow-600';
    if (attendancePercentage < 50) percentageColor = 'text-red-600';

    if (loading) {
        return <div>Cargando...</div>;
    }
    
    if (!user) return null;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-brand-text">¡Hola, {user.name.split(' ')[0]}!</h1>
                <p className="text-gray-600">Bienvenido a tu portal universitario.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Attendance Summary */}
                <Card className="flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                             <Icon name="attendance" className="w-8 h-8 text-brand-primary" />
                             <h2 className="text-xl font-bold text-brand-text">Resumen de Asistencia</h2>
                        </div>
                        <p className="text-gray-600 mb-4">Tu porcentaje de asistencia general.</p>
                    </div>
                    <div className="text-center">
                        <p className={`text-6xl font-bold ${percentageColor}`}>{attendancePercentage}%</p>
                    </div>
                     <Link to="/asistencia" className="mt-4 block text-center font-semibold text-brand-primary hover:underline">
                        Ver detalle
                    </Link>
                </Card>
                
                {/* Latest Notification */}
                {latestNotification && (
                    <Card className={`border-l-4 ${getCategoryClasses(latestNotification.category).border} ${getCategoryClasses(latestNotification.category).bg}`}>
                        <div className="flex items-center gap-3 mb-2">
                             <Icon name="notifications" className={`w-8 h-8 ${getCategoryClasses(latestNotification.category).text}`} />
                            <h2 className="text-xl font-bold text-brand-text">Última Notificación</h2>
                        </div>
                        <div>
                             <p className={`text-sm font-semibold ${getCategoryClasses(latestNotification.category).text}`}>{latestNotification.category}</p>
                             <h3 className="text-lg font-bold text-gray-800">{latestNotification.title}</h3>
                             <p className="mt-1 text-gray-600 line-clamp-3">{latestNotification.description}</p>
                        </div>
                        <Link to="/notificaciones" className="mt-3 block text-right font-semibold text-brand-primary hover:underline">
                            Ver todas
                        </Link>
                    </Card>
                )}
            </div>
            <FeedbackCard />
        </div>
    );
};

export default StudentDashboard;
