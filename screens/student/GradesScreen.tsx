import React, { useMemo, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { mockApiService } from '../../services/mockData';
import { Grade, Subject } from '../../types';
import Card from '../../components/common/Card';

// Componente para mostrar las notas de una materia
const SubjectGradesCard: React.FC<{ subject: Subject, grades: Grade[] }> = ({ subject, grades }) => {
    const [filterType, setFilterType] = useState('all');

    const evaluationTypes = useMemo(() => ['all', ...new Set(grades.map(g => g.evaluationType))], [grades]);

    const filteredGrades = useMemo(() => {
        if (filterType === 'all') return grades;
        return grades.filter(g => g.evaluationType === filterType);
    }, [grades, filterType]);

    // Determina el color de la nota (aprobado/desaprobado)
    const getScoreColor = (score: number) => {
        return score >= 4 ? 'text-green-600' : 'text-red-600';
    };

    return (
        <Card>
            <h2 className="text-xl font-bold text-brand-primary mb-2">{subject.name}</h2>
            
            {/* Filtro por tipo de evaluación */}
            {grades.length > 0 && (
                <div className="mb-4">
                    <label className="text-sm font-medium text-gray-700 mr-2">Filtrar por evaluación:</label>
                    <select value={filterType} onChange={e => setFilterType(e.target.value)} className="border-gray-300 rounded-md shadow-sm p-1.5 text-sm">
                        {evaluationTypes.map(type => <option key={type} value={type}>{type === 'all' ? 'Todas' : type}</option>)}
                    </select>
                </div>
            )}
            
            {/* Tabla de notas */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Evaluación</th>
                            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Nota</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredGrades.length > 0 ? filteredGrades.map(grade => (
                            <tr key={grade.id}>
                                <td className="px-4 py-3 text-sm font-medium text-gray-800">{grade.evaluationType}</td>
                                <td className={`px-4 py-3 text-sm font-bold text-right ${getScoreColor(grade.score)}`}>{grade.score}</td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={2} className="px-4 py-3 text-center text-sm text-gray-500">No hay notas para esta selección.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
             {grades.length === 0 && <p className="text-center text-gray-500 mt-4">Aún no hay notas cargadas para esta materia.</p>}
        </Card>
    );
};

const StudentGradesScreen: React.FC = () => {
    const { user } = useAuth();
    const [allGrades, setAllGrades] = useState<Grade[]>([]);
    const [allSubjects, setAllSubjects] = useState<Subject[]>([]);

    // Carga las notas y materias del estudiante
    React.useEffect(() => {
        if (user) {
            setAllGrades(mockApiService.getGradesForStudent(user.id));
            const studentCareers = mockApiService.getCareers().filter(c => (user as any).careers.includes(c.name));
            const subjects = studentCareers.flatMap(c => c.subjects);
            setAllSubjects(subjects);
        }
    }, [user]);

    // Agrupa las notas por materia
    const gradesBySubject = useMemo(() => {
        return allGrades.reduce((acc, grade) => {
            if (!acc[grade.subjectId]) {
                acc[grade.subjectId] = [];
            }
            acc[grade.subjectId].push(grade);
            return acc;
        }, {} as Record<string, Grade[]>);
    }, [allGrades]);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-brand-text">Mis Notas</h1>
            {allSubjects.length > 0 ? (
                 <div className="space-y-6">
                    {allSubjects.map(subject => (
                        <SubjectGradesCard key={subject.id} subject={subject} grades={gradesBySubject[subject.id] || []} />
                    ))}
                </div>
            ) : (
                <Card>
                    <p className="text-center text-gray-500">Aún no hay notas disponibles.</p>
                </Card>
            )}
        </div>
    );
};

export default StudentGradesScreen;
