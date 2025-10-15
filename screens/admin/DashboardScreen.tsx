import React, { useMemo } from 'react';
import Card from '../../components/common/Card';
import Icon, { IconName } from '../../components/common/Icon';
import { students, preceptors, admins, mockApiService } from '../../services/mockData';
import { SuggestionComplaintStatus, UserRole } from '../../types';
import { Link } from 'react-router-dom';
import UpcomingEventsCard from '../../components/dashboard/UpcomingEventsCard';

interface StatCardProps {
    title: string;
    value: number;
    icon: IconName;
    color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => (
    <Card className={`flex items-center p-6 border-l-4 ${color}`}>
        <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-500">{title}</h3>
            <p className="text-4xl font-bold text-brand-text">{value}</p>
        </div>
        <Icon name={icon} className="w-12 h-12 text-gray-300" />
    </Card>
);

const AdminDashboardScreen: React.FC = () => {
    const totalStudents = students.length;
    const totalPreceptors = preceptors.length;
    const totalAdmins = admins.length;
    
    const newSuggestionsCount = useMemo(() => {
        return mockApiService.getSuggestionsComplaints().filter(s => s.status === SuggestionComplaintStatus.NEW).length;
    }, []);
    
    const recentSuggestions = useMemo(() => {
        return mockApiService.getSuggestionsComplaints()
            .filter(s => s.status !== SuggestionComplaintStatus.RESOLVED)
            .slice(0, 5);
    }, []);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-brand-text">Dashboard del Administrador</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Alumnos Totales" value={totalStudents} icon="users" color="border-brand-primary" />
                <StatCard title="Preceptores Totales" value={totalPreceptors} icon="profile" color="border-brand-secondary" />
                <StatCard title="Sugerencias Nuevas" value={newSuggestionsCount} icon="chat" color="border-yellow-500" />
                <StatCard title="Administradores" value={totalAdmins} icon="cog" color="border-red-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Column */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <div className="flex justify-between items-center mb-4">
                             <h2 className="text-xl font-bold text-brand-text">Sugerencias y Quejas Recientes</h2>
                             <Link to="/sugerencias" className="text-sm font-semibold text-brand-primary hover:underline">Ver todas</Link>
                        </div>
                        <div className="space-y-3">
                            {recentSuggestions.length > 0 ? recentSuggestions.map(s => {
                                const user = mockApiService.getUserById(s.userId);
                                return (
                                <div key={s.id} className="p-3 bg-gray-50 rounded-lg">
                                    <div className="flex justify-between items-center text-xs">
                                        <p className="font-semibold">{user?.name || 'Anónimo'} ({s.type})</p>
                                        <span className={`px-2 py-0.5 rounded-full font-bold ${s.status === SuggestionComplaintStatus.NEW ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>{s.status}</span>
                                    </div>
                                    <p className="text-sm text-gray-700 mt-1 truncate">{s.text}</p>
                                </div>
                                )
                            }) : <p className="text-gray-500">No hay sugerencias o quejas pendientes.</p>}
                        </div>
                    </Card>
                </div>

                {/* Side Column */}
                <div className="lg:col-span-1 space-y-6">
                    <UpcomingEventsCard linkTo="/calendario-academico" />
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardScreen;