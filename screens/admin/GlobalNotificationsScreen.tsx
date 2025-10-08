import React from 'react';
import Card from '../../components/common/Card';

const GlobalNotificationsScreen: React.FC = () => {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-brand-text">Notificaciones Globales</h1>
            <Card>
                <p className="text-gray-500">Esta sección está en construcción. Aquí el administrador podrá enviar notificaciones a todos los usuarios o a grupos específicos.</p>
            </Card>
        </div>
    );
};

export default GlobalNotificationsScreen;
