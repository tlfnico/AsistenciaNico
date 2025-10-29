import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { mockApiService } from '../../services/mockData';
import { FinalExam, Professor, Student } from '../../types';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Icon from '../../components/common/Icon';

const FinalsScreen: React.FC = () => {
    const { user } = useAuth();
    const [availableFinals, setAvailableFinals] = useState<FinalExam[]>([]);
    const [myEnrollments, setMyEnrollments] = useState<FinalExam[]>([]);
    const [professors, setProfessors] = useState<Record<string, string>>({});
    
    // Función para recargar los datos
    const fetchData = () => {
        if (user) {
            setAvailableFinals(mockApiService.getAvailableFinalsForStudent(user as Student));
            setMyEnrollments(mockApiService.getStudentEnrollments(user.id));
        }
    };

    useEffect(() => {
        // Carga los datos iniciales y un mapa de profesores para mostrar sus nombres
        const allProfessors = mockApiService.getAllUsers().filter(u => u.role === 'professor') as Professor[];
        const profMap = allProfessors.reduce((acc, prof) => {
            acc[prof.id] = prof.name;
            return acc;
        }, {} as Record<string, string>);
        setProfessors(profMap);
        fetchData();
    }, [user]);

    const handleEnroll = (finalId: string) => {
        if (user && window.confirm('¿Estás seguro de que quieres inscribirte a este final?')) {
            const success = mockApiService.enrollInFinal(user.id, finalId);
            if (success) {
                alert('¡Inscripción exitosa!');
                fetchData(); // Recargar datos para reflejar el cambio
            }
        }
    };

    const handleWithdraw = (finalId: string) => {
        if (user && window.confirm('¿Estás seguro de que quieres darte de baja de este final?')) {
            mockApiService.withdrawFromFinal(user.id, finalId);
            alert('Te has dado de baja del final.');
            fetchData(); // Recargar datos
        }
    };
    
    // Componente reutilizable para renderizar una lista de finales
    const FinalsList: React.FC<{ finals: FinalExam[], isEnrollmentList: boolean }> = ({ finals, isEnrollmentList }) => (
        <div className="space-y-4">
            {finals.length > 0 ? finals.map(final => (
                <Card key={final.id} className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div>
                        <h3 className="text-lg font-bold text-brand-text">{final.subjectName}</h3>
                        <p className="text-sm text-gray-600">Profesor: {professors[final.professorId] || 'No asignado'}</p>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-gray-800">
                            <span><Icon name="calendar" className="inline w-4 h-4 mr-1"/> {new Date(final.date + 'T00:00:00').toLocaleDateString()}</span>
                            <span><Icon name="clock" className="inline w-4 h-4 mr-1"/> {final.time} hs</span>
                            <span><Icon name="academic-cap" className="inline w-4 h-4 mr-1"/> Aula: {final.classroom}</span>
                        </div>
                    </div>
                    <div className="flex-shrink-0">
                        {isEnrollmentList ? (
                            <Button variant="danger" onClick={() => handleWithdraw(final.id)}>Darse de baja</Button>
                        ) : (
                            <Button variant="success" onClick={() => handleEnroll(final.id)}>Inscribirme</Button>
                        )}
                    </div>
                </Card>
            )) : (
                <Card>
                    <p className="text-center text-gray-500">{isEnrollmentList ? 'No estás inscripto a ningún final.' : 'No hay finales disponibles para inscripción.'}</p>
                </Card>
            )}
        </div>
    );

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-brand-text mb-4">Inscripción a Finales</h1>
                <Card>
                    <h2 className="text-2xl font-semibold text-brand-text mb-4">Finales Disponibles</h2>
                    <FinalsList finals={availableFinals} isEnrollmentList={false} />
                </Card>
            </div>

            <div>
                 <Card>
                    <h2 className="text-2xl font-semibold text-brand-text mb-4">Mis Inscripciones</h2>
                    <FinalsList finals={myEnrollments} isEnrollmentList={true} />
                </Card>
            </div>
        </div>
    );
};

export default FinalsScreen;
