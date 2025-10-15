import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Admin } from '../../types';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Icon from '../../components/common/Icon';
import { useNavigate } from 'react-router-dom';

const ProfileInfoRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
        <dt className="text-sm font-medium text-gray-500">{label}</dt>
        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{value}</dd>
    </div>
);

const AdminProfileScreen: React.FC = () => {
    const { user, logout } = useAuth();
    const admin = user as Admin;
    const navigate = useNavigate();

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
                        <ProfileInfoRow label="Nombre Completo" value={admin.name} />
                        <ProfileInfoRow label="Correo Institucional" value={admin.email} />
                        <ProfileInfoRow label="Rol" value="Administrador" />
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

export default AdminProfileScreen;
