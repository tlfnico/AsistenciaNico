import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import Card from '../../components/common/Card';
import { mockApiService } from '../../services/mockData';
import { AttendanceStatus, Notification, NotificationCategory } from '../../types';
import Icon from '../../components/common/Icon';
import { Link } from 'react-router-dom';

const getCategoryClasses = (category: NotificationCategory) => {
    switch(category) {
        case NotificationCategory.ACADEMIC: return { border: 'border-blue-500', text: 'text-blue-600', bg: 'bg-blue-50' };
        case NotificationCategory.INFORMATIVE: return { border: 'border-green-500', text: 'text-green-600', bg: 'bg-green-50' };
        case NotificationCategory.URGENT: return { border: 'border-red-600', text: 'text-red-600', bg: 'bg-red-50' };
        default: return { border: 'border-gray-500', text: 'text-gray-600', bg: 'bg-gray-50'};
    }
}

const StudentDashboard: React.FC = () => {
    const { user } = useAuth();

    if (!user) return null;

    const attendanceRecords = mockApiService.getStudentAttendance(user.id);
    const totalClasses = attendanceRecords.length;
    const presentOrLate = attendanceRecords.filter(r => r.status === AttendanceStatus.PRESENT || r.status === AttendanceStatus.LATE).length;
    const attendancePercentage = totalClasses > 0 ? Math.round((presentOrLate / totalClasses) * 100) : 100;
    
    let percentageColor = 'text-green-600';
    if (attendancePercentage < 75) percentageColor = 'text-yellow-600';
    if (attendancePercentage < 50) percentageColor = 'text-red-600';

    const latestNotification = mockApiService.getNotifications()[0];

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
        </div>
    );
};

export default StudentDashboard;