import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import LoginScreen from './screens/LoginScreen';
import StudentLayout from './components/layout/StudentLayout';
import PreceptorLayout from './components/layout/PreceptorLayout';
import DashboardScreen from './screens/dashboard/DashboardScreen';
import StudentAttendanceScreen from './screens/student/AttendanceScreen';
import StudentNotificationsScreen from './screens/student/NotificationsScreen';
import StudentChatScreen from './screens/student/ChatScreen';
import StudentProfileScreen from './screens/student/ProfileScreen';
import StudentCalendarScreen from './screens/student/CalendarScreen';
import PreceptorAttendanceScreen from './screens/preceptor/AttendanceScreen';
import PreceptorNotificationsScreen from './screens/preceptor/NotificationsScreen';
import PreceptorChatScreen from './screens/preceptor/ChatScreen';
import PreceptorCalendarScreen from './screens/preceptor/CalendarScreen';
import ChatDetailScreen from './screens/ChatDetailScreen';
import { UserRole } from './types';
import PreceptorProfileScreen from './screens/preceptor/ProfileScreen';

const AppRoutes: React.FC = () => {
    const { user } = useAuth();

    if (!user) {
        return (
            <Routes>
                <Route path="/login" element={<LoginScreen />} />
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        );
    }

    if (user.role === UserRole.STUDENT) {
        return (
            <StudentLayout>
                <Routes>
                    <Route path="/" element={<Navigate to="/inicio" replace />} />
                    <Route path="/inicio" element={<DashboardScreen />} />
                    <Route path="/asistencia" element={<StudentAttendanceScreen />} />
                    <Route path="/notificaciones" element={<StudentNotificationsScreen />} />
                    <Route path="/calendario" element={<StudentCalendarScreen />} />
                    <Route path="/chat" element={<StudentChatScreen />} />
                    <Route path="/chat/:id" element={<ChatDetailScreen />} />
                    <Route path="/perfil" element={<StudentProfileScreen />} />
                    <Route path="*" element={<Navigate to="/inicio" />} />
                </Routes>
            </StudentLayout>
        );
    }

    if (user.role === UserRole.PRECEPTOR) {
        return (
            <PreceptorLayout>
                <Routes>
                    <Route path="/" element={<Navigate to="/inicio" replace />} />
                    <Route path="/inicio" element={<DashboardScreen />} />
                    <Route path="/asistencia" element={<PreceptorAttendanceScreen />} />
                    <Route path="/notificaciones" element={<PreceptorNotificationsScreen />} />
                    <Route path="/calendario" element={<PreceptorCalendarScreen />} />
                    <Route path="/chat" element={<PreceptorChatScreen />} />
                    <Route path="/chat/:id" element={<ChatDetailScreen />} />
                    <Route path="/perfil" element={<PreceptorProfileScreen />} />
                    <Route path="*" element={<Navigate to="/inicio" />} />
                </Routes>
            </PreceptorLayout>
        );
    }

    return <Navigate to="/login" />;
};


const App: React.FC = () => {
    return (
        <AuthProvider>
            <HashRouter>
                <AppRoutes />
            </HashRouter>
        </AuthProvider>
    );
};

export default App;