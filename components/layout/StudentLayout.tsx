import React, { ReactNode } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Icon, { IconName } from '../common/Icon';
import Button from '../common/Button';

interface NavItem {
    path: string;
    label: string;
    icon: IconName;
}

const navItems: NavItem[] = [
    { path: '/inicio', label: 'Inicio', icon: 'home' },
    { path: '/asistencia', label: 'Asistencia', icon: 'attendance' },
    { path: '/notificaciones', label: 'Notificaciones', icon: 'notifications' },
    { path: '/calendario', label: 'Calendario', icon: 'calendar' },
    { path: '/chat', label: 'Chat', icon: 'chat' },
    { path: '/perfil', label: 'Perfil', icon: 'profile' },
];

const StudentLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };
    
    const navLinkClasses = "flex flex-col md:flex-row items-center justify-center md:justify-start p-2 md:p-3 rounded-lg transition-colors duration-200";
    const activeNavLinkClasses = "bg-brand-accent text-brand-primary";
    const inactiveNavLinkClasses = "text-gray-600 md:text-white hover:bg-brand-secondary hover:text-white";

    return (
        <div className="flex flex-col md:flex-row h-screen bg-brand-background">
            {/* Sidebar for medium and up */}
            <aside className="hidden md:flex md:flex-col md:w-64 bg-brand-primary text-white p-4 justify-between">
                <div>
                    <div className="mb-8 text-center">
                        <h1 className="text-2xl font-bold">Asistencia</h1>
                        <h2 className="text-xl">Universitaria</h2>
                        <p className="text-sm mt-2 text-blue-200">{user?.name}</p>
                    </div>
                    <nav className="flex flex-col gap-2">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : inactiveNavLinkClasses}`}
                            >
                                <Icon name={item.icon} className="w-6 h-6 md:mr-3" />
                                <span className="text-sm md:text-base">{item.label}</span>
                            </NavLink>
                        ))}
                    </nav>
                </div>
                <Button onClick={handleLogout} variant="secondary" className="w-full flex items-center justify-center gap-2">
                    <Icon name="logout" className="w-5 h-5" />
                    Cerrar Sesión
                </Button>
            </aside>

            <main className="flex-1 overflow-y-auto p-4 md:p-8 mb-16 md:mb-0">
                {children}
            </main>

            {/* Bottom Nav for small screens */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 flex justify-around">
                {navItems.map((item) => (
                     <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `${navLinkClasses} w-full ${isActive ? 'text-brand-primary' : 'text-gray-500'}`}
                    >
                        <Icon name={item.icon} className="w-6 h-6 mb-1" />
                        <span className="text-xs">{item.label}</span>
                    </NavLink>
                ))}
            </nav>
        </div>
    );
};

export default StudentLayout;