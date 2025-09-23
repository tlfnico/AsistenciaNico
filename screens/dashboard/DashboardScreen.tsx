
import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { UserRole } from '../../types';
import StudentDashboard from './StudentDashboard';
import PreceptorDashboard from './PreceptorDashboard';

const DashboardScreen: React.FC = () => {
    const { user } = useAuth();

    if (!user) {
        return null;
    }

    return (
        <div>
            {user.role === UserRole.STUDENT ? <StudentDashboard /> : <PreceptorDashboard />}
        </div>
    );
};

export default DashboardScreen;
