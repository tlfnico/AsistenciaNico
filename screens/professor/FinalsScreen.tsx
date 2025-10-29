import React, { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { mockApiService } from '../../services/mockData';
import { FinalExam, Student, Subject } from '../../types';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Icon from '../../components/common/Icon';

// Modal para ver los alumnos inscriptos
const EnrolledStudentsModal: React.FC<{
    final: FinalExam;
    onClose: () => void;
}> = ({ final, onClose }) => {
    const [enrolledStudents, setEnrolledStudents] = useState<Student[]>([]);

    useEffect(() => {
        setEnrolledStudents(mockApiService.getEnrolledStudentsForFinal(final.id));
    }, [final]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={onClose}>
            <Card className="w-11/12 max-w-lg" onClick={e => e.stopPropagation()}>
                <h3 className="text-xl font-bold mb-2 text-brand-text">Inscriptos en {final.subjectName}</h3>
                <p className="text-sm text-gray-500 mb-4">{new Date(final.date + 'T00:00:00').toLocaleDateString()} - {final.time} hs</p>
                
                <div className="max-h-80 overflow-y-auto space-y-2">
                    {enrolledStudents.length > 0 ? (
                        enrolledStudents.map(student => (
                            <div key={student.id} className="p-2 bg-gray-50 rounded-md">
                                <p className="font-medium text-gray-800">{student.name}</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500 py-4">No hay alumnos inscriptos.</p>
                    )}
                </div>
                <div className="mt-6 flex justify-end">
                    <Button variant="secondary" onClick={onClose}>Cerrar</Button>
                </div>
            </Card>
        </div>
    );
};


const ProfessorFinalsScreen: React.FC = () => {
    const { user } = useAuth();
    const [myFinals, setMyFinals] = useState<FinalExam[]>([]);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [viewingEnrollments, setViewingEnrollments] = useState<FinalExam | null>(null);

    const professorSubjects = useMemo(() => {
        if (!user) return [];
        return mockApiService.getSubjectsByProfessor(user.id);
    }, [user]);

    // Estado para el formulario de nuevo final
    const [newFinal, setNewFinal] = useState({
        subjectId: '',
        date: '',
        time: '',
        classroom: '',
        capacity: '25'
    });

    const fetchData = () => {
        if (user) {
            setMyFinals(mockApiService.getFinalsByProfessor(user.id));
        }
    };

    useEffect(fetchData, [user]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setNewFinal({ ...newFinal, [e.target.name]: e.target.value });
    };

    const handleCreateFinal = (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !newFinal.subjectId || !newFinal.date || !newFinal.time || !newFinal.classroom) {
            alert('Por favor complete todos los campos.');
            return;
        }
        
        const subject = professorSubjects.find(s => s.id === newFinal.subjectId);
        if (!subject) return;

        mockApiService.createFinal({
            ...newFinal,
            subjectName: subject.name,
            professorId: user.id,
            capacity: parseInt(newFinal.capacity, 10)
        });

        alert('Mesa de final creada exitosamente.');
        setIsFormVisible(false); // Ocultar formulario después de crear
        fetchData(); // Recargar la lista de finales
    };
    
    const handleDeleteFinal = (finalId: string) => {
        if (window.confirm('¿Está seguro de que quiere eliminar esta mesa de final? Esta acción es irreversible.')) {
            mockApiService.deleteFinal(finalId);
            fetchData();
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-brand-text">Gestión de Finales</h1>
                <Button onClick={() => setIsFormVisible(!isFormVisible)}>
                     <div className="flex items-center gap-2">
                        <Icon name={isFormVisible ? 'minus' : 'plus'} className="w-5 h-5"/>
                        <span>{isFormVisible ? 'Ocultar Formulario' : 'Crear Final'}</span>
                    </div>
                </Button>
            </div>

            {/* Formulario para crear un nuevo final */}
            {isFormVisible && (
                <Card>
                    <h2 className="text-2xl font-semibold text-brand-text mb-4">Crear Nueva Mesa de Final</h2>
                    <form onSubmit={handleCreateFinal} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <select name="subjectId" value={newFinal.subjectId} onChange={handleInputChange} required className="border-gray-300 rounded-md p-2">
                            <option value="">Seleccionar materia</option>
                            {professorSubjects.map(s => <option key={s.id} value={s.id}>{s.name} ({s.careerName})</option>)}
                        </select>
                        <input type="date" name="date" value={newFinal.date} onChange={handleInputChange} required className="border-gray-300 rounded-md p-2"/>
                        <input type="time" name="time" value={newFinal.time} onChange={handleInputChange} required className="border-gray-300 rounded-md p-2"/>
                        <input type="text" name="classroom" placeholder="Aula" value={newFinal.classroom} onChange={handleInputChange} required className="border-gray-300 rounded-md p-2"/>
                        <input type="number" name="capacity" placeholder="Cupo" value={newFinal.capacity} onChange={handleInputChange} required min="1" className="border-gray-300 rounded-md p-2"/>
                        <Button type="submit" className="md:col-span-2">Crear Final</Button>
                    </form>
                </Card>
            )}

            {/* Lista de finales creados */}
            <Card>
                <h2 className="text-2xl font-semibold text-brand-text mb-4">Finales Creados</h2>
                <div className="space-y-4">
                    {myFinals.length > 0 ? myFinals.map(final => (
                        <div key={final.id} className="p-4 border rounded-lg bg-gray-50 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                            <div>
                                <h3 className="text-lg font-bold">{final.subjectName}</h3>
                                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-gray-700">
                                    <span><Icon name="calendar" className="inline w-4 h-4 mr-1"/> {new Date(final.date + 'T00:00:00').toLocaleDateString()}</span>
                                    <span><Icon name="clock" className="inline w-4 h-4 mr-1"/> {final.time} hs</span>
                                    <span><Icon name="academic-cap" className="inline w-4 h-4 mr-1"/> Aula: {final.classroom}</span>
                                    <span><Icon name="users" className="inline w-4 h-4 mr-1"/> Cupo: {final.capacity}</span>
                                </div>
                            </div>
                            <div className="flex gap-2 self-end sm:self-center">
                                <Button variant="secondary" onClick={() => setViewingEnrollments(final)}>Ver Inscriptos</Button>
                                <Button variant="danger" onClick={() => handleDeleteFinal(final.id)}>Eliminar</Button>
                            </div>
                        </div>
                    )) : (
                        <p className="text-center text-gray-500">No has creado ninguna mesa de final.</p>
                    )}
                </div>
            </Card>

            {viewingEnrollments && (
                <EnrolledStudentsModal final={viewingEnrollments} onClose={() => setViewingEnrollments(null)} />
            )}
        </div>
    );
};

export default ProfessorFinalsScreen;
