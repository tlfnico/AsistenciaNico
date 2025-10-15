import React, { useMemo } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Professor, Subject } from '../../types';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Icon from '../../components/common/Icon';
import { useNavigate } from 'react-router-dom';
import { mockApiService } from '../../services/mockData';

const ProfileInfoRow: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
    <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
        <dt className="text-sm font-medium text-gray-500">{label}</dt>
        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{value}</dd>
    </div>
);

const ProfessorProfileScreen: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const professor = user as Professor;

    const subjects = useMemo(() => {
        if (!user) return [];
        return mockApiService.getSubjectsByProfessor(user.id);
    }, [user]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-brand-text">Mi Perfil</h1>
            <Card>
                <div className="border-t border-gray-200">
                    <dl className="divide-y divide-gray-200">
                        <ProfileInfoRow label="Nombre Completo" value={professor.name} />
                        <ProfileInfoRow label="Correo Institucional" value={professor.email} />
                        <ProfileInfoRow 
                            label="Materias a Cargo" 
                            value={
                                <ul className="list-disc list-inside space-y-1">
                                    {subjects.map(s => <li key={s.id}>{s.name} ({s.careerName})</li>)}
                                </ul>
                            } 
                        />
                    </dl>
                </div>
                 <div className="mt-6 flex justify-end">
                    <Button onClick={handleLogout} variant="danger" className="flex items-center justify-center gap-2">
                        <Icon name="logout" className="w-5 h-5" />
                        Cerrar Sesión
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default ProfessorProfileScreen;