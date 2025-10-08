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
    { path: '/usuarios', label: 'Usuarios', icon: 'users' },
    { path: '/carreras', label: 'Carreras', icon: 'academic-cap' },
    { path: '/sugerencias', label: 'Sugerencias', icon: 'chat' },
    { path: '/notificaciones-globales', label: 'Notificaciones', icon: 'notifications' },
    { path: '/calendario-academico', label: 'Calendario', icon: 'calendar' },
    { path: '/configuracion', label: 'Configuración', icon: 'cog' },
];

const AdminLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };
    
    // Classes for Desktop Sidebar
    const desktopNavLinkClasses = "flex items-center p-3 rounded-lg transition-colors duration-200";
    const desktopActiveNavLink = "bg-brand-accent text-brand-primary";
    const desktopInactiveNavLink = "text-white hover:bg-brand-secondary";
    
    // Classes for Mobile Bottom Nav
    const mobileNavLinkClasses = "flex flex-col items-center justify-center p-2 rounded-lg transition-colors duration-200 w-full";
    const mobileActiveNavLink = "text-brand-primary";
    const mobileInactiveNavLink = "text-gray-500";


    return (
        <div className="flex flex-col md:flex-row h-screen bg-brand-background">
            {/* Sidebar for medium and up */}
            <aside className="hidden md:flex md:flex-col md:w-72 bg-brand-primary text-white p-4 justify-between">
                 <div>
                    <div className="mb-10 text-center">
                        <h1 className="text-3xl font-bold">Panel</h1>
                        <h2 className="text-2xl">Admin</h2>
                        <p className="text-md mt-4 text-blue-200">{user?.name}</p>
                    </div>
                    <nav className="flex flex-col gap-3">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) => `${desktopNavLinkClasses} ${isActive ? desktopActiveNavLink : desktopInactiveNavLink}`}
                            >
                                <Icon name={item.icon} className="w-6 h-6 mr-4" />
                                <span className="text-lg">{item.label}</span>
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
                        className={({ isActive }) => `${mobileNavLinkClasses} ${isActive ? mobileActiveNavLink : mobileInactiveNavLink}`}
                    >
                        <Icon name={item.icon} className="w-6 h-6 mb-1" />
                        <span className="text-xs">{item.label}</span>
                    </NavLink>
                ))}
            </nav>
        </div>
    );
};

export default AdminLayout;