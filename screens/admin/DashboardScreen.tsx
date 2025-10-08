import React from 'react';
import Card from '../../components/common/Card';
import Icon, { IconName } from '../../components/common/Icon';
// Fix: Import `careers` instead of `subjectsByCareer` as it is the correct exported member.
import { students, preceptors, admins, careers } from '../../services/mockData';

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
    // Fix: Use `careers.length` to get the total number of careers.
    const totalCareers = careers.length;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-brand-text">Dashboard del Administrador</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Alumnos Totales" value={totalStudents} icon="users" color="border-brand-primary" />
                <StatCard title="Preceptores Totales" value={totalPreceptors} icon="profile" color="border-brand-secondary" />
                <StatCard title="Administradores" value={totalAdmins} icon="cog" color="border-red-500" />
                <StatCard title="Carreras" value={totalCareers} icon="academic-cap" color="border-green-500" />
            </div>

            <Card>
                <h2 className="text-2xl font-bold text-brand-text mb-4">Bienvenido al Panel de Administración</h2>
                <p className="text-gray-600">
                    Desde aquí puedes gestionar todos los aspectos de la aplicación, incluyendo usuarios, carreras, notificaciones y más.
                    Utiliza el menú de navegación para acceder a las diferentes secciones.
                </p>
            </Card>
        </div>
    );
};

export default AdminDashboardScreen;
