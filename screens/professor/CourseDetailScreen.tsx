import React, { useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import { mockApiService } from '../../services/mockData';
import { AttendanceStatus } from '../../types';
import Button from '../../components/common/Button';
import { useAuth } from '../../hooks/useAuth';
import Icon from '../../components/common/Icon';

const CourseDetailScreen: React.FC = () => {
    const { subjectId } = useParams<{ subjectId: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();

    const subjectDetails = useMemo(() => {
        if (!subjectId) return null;
        for (const career of mockApiService.getCareers()) {
            const subject = career.subjects.find(s => s.id === subjectId);
            if (subject) {
                return { ...subject, careerName: career.name };
            }
        }
        return null;
    }, [subjectId]);

    const students = useMemo(() => {
        if (!subjectDetails) return [];
        return mockApiService.getStudentsBySubject(subjectDetails.name);
    }, [subjectDetails]);

    const studentAttendance = useMemo(() => {
        if (!subjectDetails) return [];
        const attendanceData: { [studentId: string]: { percentage: number, color: string } } = {};
        
        students.forEach(student => {
            const records = mockApiService.getStudentAttendance(student.id)
                .filter(rec => rec.subject === subjectDetails.name);
            
            const total = records.length;
            const present = records.filter(r => r.status === AttendanceStatus.PRESENT || r.status === AttendanceStatus.LATE).length;
            const percentage = total > 0 ? Math.round((present / total) * 100) : 100;
            
            let color = 'bg-green-500';
            if (percentage < 75) color = 'bg-yellow-500';
            if (percentage < 50) color = 'bg-red-500';
            
            attendanceData[student.id] = { percentage, color };
        });
        return attendanceData;
    }, [students, subjectDetails]);

    const handleSendMessage = (studentId: string) => {
        if (!user) return;
        const conversation = mockApiService.getOrCreateConversation(user.id, studentId);
        navigate(`/chat/${conversation.id}`);
    };

    const handleCreateCourseGroup = () => {
        if (!user || !subjectDetails) return;
        // Fix: Changed getOrCreateCourseGroup to getOrCreateSubjectGroup, which is the correct function name in mockApiService.
        const group = mockApiService.getOrCreateSubjectGroup(subjectDetails.id, subjectDetails.name, user.id);
        navigate(`/chat/${group.id}`);
    };

    if (!subjectDetails) {
        return <Card><p>Materia no encontrada.</p></Card>;
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                    <Link to="/cursos" className="text-brand-primary hover:underline mb-2 inline-block">&larr; Volver a Mis Cursos</Link>
                    <h1 className="text-3xl font-bold text-brand-text">{subjectDetails.name}</h1>
                    <p className="text-gray-600">{subjectDetails.careerName} - {subjectDetails.year}° Año</p>
                </div>
                <Button onClick={handleCreateCourseGroup}>
                    <div className="flex items-center gap-2">
                        <Icon name="chat" className="w-5 h-5" />
                        <span>Chat Grupal del Curso</span>
                    </div>
                </Button>
            </div>


            <Card>
                <h2 className="text-xl font-bold text-brand-text mb-4">Lista de Alumnos ({students.length})</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Asistencia</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {students.map(student => (
                                <tr key={student.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <div className="flex items-center gap-2">
                                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                <div 
                                                    className={`${studentAttendance[student.id]?.color} h-2.5 rounded-full`} 
                                                    style={{ width: `${studentAttendance[student.id]?.percentage || 0}%`}}
                                                ></div>
                                            </div>
                                            <span className="font-semibold">{studentAttendance[student.id]?.percentage || 100}%</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <Button 
                                            variant="secondary" 
                                            className="!py-1 !px-3"
                                            onClick={() => handleSendMessage(student.id)}
                                        >
                                            Enviar Mensaje
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default CourseDetailScreen;