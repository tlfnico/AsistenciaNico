import React, { useMemo, useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockApiService } from '../../services/mockData';
import { Grade, Student, Subject } from '../../types';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Icon from '../../components/common/Icon';

// Componente para el formulario de agregar/editar nota (Modal)
const GradeFormModal: React.FC<{
    student: Student;
    subjectId: string;
    existingGrade: Grade | null;
    onClose: () => void;
    onSave: () => void;
}> = ({ student, subjectId, existingGrade, onClose, onSave }) => {
    const [evaluationType, setEvaluationType] = useState(existingGrade?.evaluationType || '');
    const [score, setScore] = useState<string>(existingGrade?.score.toString() || '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const numericScore = parseFloat(score);
        if (evaluationType.trim() && !isNaN(numericScore) && numericScore >= 0 && numericScore <= 10) {
            mockApiService.addOrUpdateGrade({
                id: existingGrade?.id,
                studentId: student.id,
                subjectId,
                evaluationType: evaluationType.trim(),
                score: numericScore
            });
            onSave();
        } else {
            alert('Por favor, ingrese un tipo de evaluación válido y una nota entre 0 y 10.');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={onClose}>
            <Card className="w-11/12 max-w-md" onClick={e => e.stopPropagation()}>
                <h3 className="text-xl font-bold mb-2 text-brand-text">{existingGrade ? 'Editar' : 'Agregar'} Nota</h3>
                <p className="text-gray-600 mb-4">para <span className="font-semibold">{student.name}</span></p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Tipo de evaluación (Ej: Parcial 1)"
                        value={evaluationType}
                        onChange={e => setEvaluationType(e.target.value)}
                        className="w-full border-gray-300 rounded-md shadow-sm p-2"
                        required
                    />
                    <input
                        type="number"
                        placeholder="Nota (0-10)"
                        value={score}
                        onChange={e => setScore(e.target.value)}
                        min="0" max="10" step="0.01"
                        className="w-full border-gray-300 rounded-md shadow-sm p-2"
                        required
                    />
                    <div className="flex justify-end gap-2">
                        <Button variant="secondary" type="button" onClick={onClose}>Cancelar</Button>
                        <Button type="submit">Guardar</Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

const ProfessorGradeDetailScreen: React.FC = () => {
    const { subjectId } = useParams<{ subjectId: string }>();
    const [subject, setSubject] = useState<(Subject & { careerName: string }) | null>(null);
    const [students, setStudents] = useState<Student[]>([]);
    const [grades, setGrades] = useState<Grade[]>([]);
    const [editingState, setEditingState] = useState<{ student: Student, grade: Grade | null } | null>(null);

    // Carga los datos de la materia, alumnos y notas
    const fetchData = () => {
        if (!subjectId) return;
        const allSubjects = mockApiService.getCareers().flatMap(c => c.subjects.map(s => ({...s, careerName: c.name})));
        const currentSubject = allSubjects.find(s => s.id === subjectId) || null;
        setSubject(currentSubject);
        setStudents(mockApiService.getStudentsBySubjectId(subjectId));
        setGrades(mockApiService.getGradesBySubject(subjectId));
    };

    useEffect(fetchData, [subjectId]);

    // Agrupa las notas por estudiante para fácil acceso
    const gradesByStudent = useMemo(() => {
        return grades.reduce((acc, grade) => {
            if (!acc[grade.studentId]) {
                acc[grade.studentId] = [];
            }
            acc[grade.studentId].push(grade);
            return acc;
        }, {} as Record<string, Grade[]>);
    }, [grades]);
    
    // Función para cerrar el modal y refrescar los datos
    const handleModalSave = () => {
        setEditingState(null);
        fetchData();
    };

    // Determina el color del badge de la nota
    const getScoreBadgeClass = (score: number) => {
        return score >= 4 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800';
    };

    if (!subject) {
        return <Card><p>Materia no encontrada.</p></Card>;
    }

    return (
        <div className="space-y-6">
            <div>
                <Link to="/notas" className="text-brand-primary hover:underline mb-2 inline-block">&larr; Volver a Mis Materias</Link>
                <h1 className="text-3xl font-bold text-brand-text">{subject.name}</h1>
                <p className="text-gray-600">{subject.careerName} - {subject.year}° Año</p>
            </div>

            <Card>
                <h2 className="text-xl font-bold text-brand-text mb-4">Notas de Alumnos</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Alumno</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Notas Cargadas</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {students.map(student => (
                                <tr key={student.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <div className="flex flex-wrap gap-2">
                                            {(gradesByStudent[student.id] || []).map(grade => (
                                                <span key={grade.id} onClick={() => setEditingState({ student, grade })} className={`px-2 py-1 rounded-md text-xs font-semibold cursor-pointer ${getScoreBadgeClass(grade.score)}`}>
                                                    {grade.evaluationType}: <span className="font-bold">{grade.score}</span>
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <Button variant="secondary" className="!py-1 !px-3 text-xs" onClick={() => setEditingState({ student, grade: null })}>
                                            <div className="flex items-center gap-1">
                                                <Icon name="plus" className="w-4 h-4" />
                                                <span>Añadir Nota</span>
                                            </div>
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            {editingState && (
                <GradeFormModal
                    student={editingState.student}
                    subjectId={subjectId!}
                    existingGrade={editingState.grade}
                    onClose={() => setEditingState(null)}
                    onSave={handleModalSave}
                />
            )}
        </div>
    );
};

export default ProfessorGradeDetailScreen;
