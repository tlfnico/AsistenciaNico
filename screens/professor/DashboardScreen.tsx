import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import Card from '../../components/common/Card';
import Icon, { IconName } from '../../components/common/Icon';
import { mockApiService } from '../../services/mockData';
import { AttendanceStatus } from '../../types';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import UpcomingEventsCard from '../../components/dashboard/UpcomingEventsCard';
import PersonalTasksCard from '../../components/dashboard/PersonalTasksCard';

const StatCard: React.FC<{ title: string; value: string | number; icon: IconName; color: string; }> = ({ title, value, icon, color }) => (
    <Card className={`flex items-center p-6 border-l-4 ${color}`}>
        <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-500">{title}</h3>
            <p className="text-4xl font-bold text-brand-text">{value}</p>
        </div>
        <Icon name={icon} className="w-12 h-12 text-gray-300" />
    </Card>
);

const ProfessorDashboardScreen: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    if (!user) return null;

    const subjects = mockApiService.getSubjectsByProfessor(user.id);
    const subjectNames = subjects.map(s => s.name);
    
    const allAttendance = mockApiService.getStudentAttendance('').filter(rec => subjectNames.includes(rec.subject));
    const totalPresent = allAttendance.filter(rec => rec.status === AttendanceStatus.PRESENT || rec.status === AttendanceStatus.LATE).length;
    const attendancePercentage = allAttendance.length > 0 ? `${Math.round((totalPresent / allAttendance.length) * 100)}%` : 'N/A';
    
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-brand-text">¡Hola, {user.name}!</h1>
                <p className="text-gray-600">Bienvenido a tu portal de profesor.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <StatCard title="Materias Asignadas" value={subjects.length} icon="academic-cap" color="border-brand-primary" />
                <StatCard title="Asistencia Promedio" value={attendancePercentage} icon="chart-pie" color="border-green-500" />
            </div>

            <Card>
                <h2 className="text-xl font-bold text-brand-text mb-4">Acciones Rápidas</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Button onClick={() => navigate('/asistencia')} className="!py-4 !text-lg flex items-center justify-center gap-2">
                        <Icon name="attendance" className="w-6 h-6" />
                        Tomar Asistencia
                    </Button>
                    <Button onClick={() => navigate('/cursos')} variant="secondary" className="!py-4 !text-lg flex items-center justify-center gap-2">
                        <Icon name="academic-cap" className="w-6 h-6" />
                        Mis Cursos
                    </Button>
                </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <UpcomingEventsCard linkTo="/calendario" title="Próximos Eventos del Calendario" />
                <PersonalTasksCard />
            </div>
        </div>
    );
};

export default ProfessorDashboardScreen;