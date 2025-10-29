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
import AdminLayout from './components/layout/AdminLayout';
import AdminDashboardScreen from './screens/admin/DashboardScreen';
import UserManagementScreen from './screens/admin/UserManagementScreen';
import CareerManagementScreen from './screens/admin/CareerManagementScreen';
import SuggestionsScreen from './screens/admin/ReportsScreen';
import GlobalNotificationsScreen from './screens/admin/GlobalNotificationsScreen';
import AcademicCalendarScreen from './screens/admin/AcademicCalendarScreen';
import SettingsScreen from './screens/admin/SettingsScreen';
import AdminProfileScreen from './screens/admin/ProfileScreen';
import AdminChatScreen from './screens/admin/ChatScreen';

// Professor Imports
import ProfessorLayout from './components/layout/ProfessorLayout';
import ProfessorDashboardScreen from './screens/professor/DashboardScreen';
import ProfessorAttendanceScreen from './screens/professor/AttendanceScreen';
import ProfessorCoursesScreen from './screens/professor/CoursesScreen';
import ProfessorCourseDetailScreen from './screens/professor/CourseDetailScreen';
import ProfessorNotificationsScreen from './screens/professor/NotificationsScreen';
import ProfessorChatScreen from './screens/professor/ChatScreen';
import ProfessorCalendarScreen from './screens/professor/CalendarScreen';
import ProfessorSuggestionsScreen from './screens/professor/SuggestionsScreen';
import ProfessorProfileScreen from './screens/professor/ProfileScreen';

// New Imports for Grades and Finals
import StudentGradesScreen from './screens/student/GradesScreen';
import StudentFinalsScreen from './screens/student/FinalsScreen';
import ProfessorGradesScreen from './screens/professor/GradesScreen';
import ProfessorGradeDetailScreen from './screens/professor/GradeDetailScreen';
import ProfessorFinalsScreen from './screens/professor/FinalsScreen';


const AppRoutes: React.FC = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
             <div className="flex items-center justify-center min-h-screen">
                <p>Cargando...</p>
            </div>
        )
    }

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
                    <Route path="/notas" element={<StudentGradesScreen />} />
                    <Route path="/finales" element={<StudentFinalsScreen />} />
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

    if (user.role === UserRole.ADMIN) {
        return (
            <AdminLayout>
                <Routes>
                    <Route path="/" element={<Navigate to="/inicio" replace />} />
                    <Route path="/inicio" element={<AdminDashboardScreen />} />
                    <Route path="/usuarios" element={<UserManagementScreen />} />
                    <Route path="/carreras" element={<CareerManagementScreen />} />
                    <Route path="/sugerencias" element={<SuggestionsScreen />} />
                    <Route path="/chat" element={<AdminChatScreen />} />
                    <Route path="/chat/:id" element={<ChatDetailScreen />} />
                    <Route path="/notificaciones-globales" element={<GlobalNotificationsScreen />} />
                    <Route path="/calendario-academico" element={<AcademicCalendarScreen />} />
                    <Route path="/perfil" element={<AdminProfileScreen />} />
                    <Route path="/configuracion" element={<SettingsScreen />} />
                    <Route path="*" element={<Navigate to="/inicio" />} />
                </Routes>
            </AdminLayout>
        );
    }

    if (user.role === UserRole.PROFESSOR) {
        return (
            <ProfessorLayout>
                <Routes>
                    <Route path="/" element={<Navigate to="/inicio" replace />} />
                    <Route path="/inicio" element={<ProfessorDashboardScreen />} />
                    <Route path="/asistencia" element={<ProfessorAttendanceScreen />} />
                    <Route path="/cursos" element={<ProfessorCoursesScreen />} />
                    <Route path="/cursos/:subjectId" element={<ProfessorCourseDetailScreen />} />
                    <Route path="/notificaciones" element={<ProfessorNotificationsScreen />} />
                    <Route path="/chat" element={<ProfessorChatScreen />} />
                    <Route path="/chat/:id" element={<ChatDetailScreen />} />
                    <Route path="/calendario" element={<ProfessorCalendarScreen />} />
                    <Route path="/sugerencias" element={<ProfessorSuggestionsScreen />} />
                    <Route path="/perfil" element={<ProfessorProfileScreen />} />
                    <Route path="/notas" element={<ProfessorGradesScreen />} />
                    <Route path="/notas/:subjectId" element={<ProfessorGradeDetailScreen />} />
                    <Route path="/finales" element={<ProfessorFinalsScreen />} />
                    <Route path="*" element={<Navigate to="/inicio" />} />
                </Routes>
            </ProfessorLayout>
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
