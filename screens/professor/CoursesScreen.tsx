import React, { useMemo } from 'react';
import Card from '../../components/common/Card';
import { useAuth } from '../../hooks/useAuth';
import { mockApiService } from '../../services/mockData';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/common/Icon';

const CoursesScreen: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const subjects = useMemo(() => {
        if (!user) return [];
        return mockApiService.getSubjectsByProfessor(user.id);
    }, [user]);

    const subjectsWithStudentCount = useMemo(() => {
        return subjects.map(subject => {
            const students = mockApiService.getStudentsBySubject(subject.name);
            return {
                ...subject,
                studentCount: students.length
            };
        });
    }, [subjects]);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-brand-text">Mis Cursos</h1>
            
            {subjectsWithStudentCount.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {subjectsWithStudentCount.map(subject => (
                        <Card 
                            key={subject.id} 
                            onClick={() => navigate(`/cursos/${subject.id}`)}
                            className="cursor-pointer hover:shadow-xl hover:border-brand-primary border-transparent border-2 transition-all duration-200"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-2xl font-bold text-brand-primary">{subject.name}</h2>
                                    <p className="text-gray-600">{subject.careerName}</p>
                                    <p className="text-sm font-semibold text-gray-500 mt-1">{subject.year}° Año</p>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Icon name="users" className="w-5 h-5" />
                                        <span className="font-bold text-lg">{subject.studentCount}</span>
                                    </div>
                                    <p className="text-xs text-gray-500">Alumnos</p>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card>
                    <p className="text-center text-gray-500">No tienes materias asignadas.</p>
                </Card>
            )}
        </div>
    );
};

export default CoursesScreen;
