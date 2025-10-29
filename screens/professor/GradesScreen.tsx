import React, { useMemo } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { mockApiService } from '../../services/mockData';
import Card from '../../components/common/Card';
import { useNavigate } from 'react-router-dom';

const ProfessorGradesScreen: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    // Obtiene las materias asignadas al profesor logueado
    const subjects = useMemo(() => {
        if (!user) return [];
        return mockApiService.getSubjectsByProfessor(user.id);
    }, [user]);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-brand-text">Gestión de Notas</h1>
            <p className="text-gray-600">Selecciona una materia para ver, agregar o editar las notas de los alumnos.</p>

            {subjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {subjects.map(subject => (
                        <Card 
                            key={subject.id}
                            // Al hacer clic, navega a la pantalla de detalle de notas para esa materia
                            onClick={() => navigate(`/notas/${subject.id}`)}
                            className="cursor-pointer hover:shadow-xl hover:border-brand-primary border-transparent border-2 transition-all duration-200"
                        >
                            <h2 className="text-xl font-bold text-brand-primary">{subject.name}</h2>
                            <p className="text-gray-600">{subject.careerName}</p>
                            <p className="text-sm font-semibold text-gray-500 mt-1">{subject.year}° Año</p>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card>
                    <p className="text-center text-gray-500">No tienes materias asignadas para gestionar notas.</p>
                </Card>
            )}
        </div>
    );
};

export default ProfessorGradesScreen;
