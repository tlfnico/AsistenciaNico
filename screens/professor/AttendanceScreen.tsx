import React, { useState, useMemo, useEffect } from 'react';
import { mockApiService } from '../../services/mockData';
import { Student, AttendanceStatus, Subject } from '../../types';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { useAuth } from '../../hooks/useAuth';

type AttendanceState = { [studentId: string]: AttendanceStatus };

const ProfessorAttendanceScreen: React.FC = () => {
    const { user } = useAuth();
    const [selectedSubject, setSelectedSubject] = useState<string>('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [students, setStudents] = useState<Student[]>([]);
    const [attendance, setAttendance] = useState<AttendanceState>({});
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const professorSubjects = useMemo(() => {
        if (!user) return [];
        return mockApiService.getSubjectsByProfessor(user.id);
    }, [user]);

    useEffect(() => {
        if (selectedSubject) {
            setIsLoading(true);
            setTimeout(() => {
                const subjectStudents = mockApiService.getStudentsBySubject(selectedSubject);
                setStudents(subjectStudents);
                const initialAttendance: AttendanceState = {};
                subjectStudents.forEach(s => { initialAttendance[s.id] = AttendanceStatus.PRESENT; });
                setAttendance(initialAttendance);
                setIsLoading(false);
            }, 300);
        } else {
            setStudents([]);
        }
    }, [selectedSubject]);

    const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
        setAttendance(prev => ({ ...prev, [studentId]: status }));
    };
    
    const markAll = (status: AttendanceStatus) => {
        const newAttendance: AttendanceState = {};
        students.forEach(s => { newAttendance[s.id] = status; });
        setAttendance(newAttendance);
    };

    const handleSaveAttendance = () => {
        if (!selectedSubject) {
            alert('Por favor, seleccione una materia.');
            return;
        }
        
        const recordsToSave = Object.keys(attendance).map(studentId => ({ studentId, status: attendance[studentId] }));
        mockApiService.saveAttendance(recordsToSave, selectedSubject, date);
        setFeedbackMessage('¡Asistencia guardada con éxito!');
        setTimeout(() => setFeedbackMessage(''), 3000);
    };
    
    const formattedDateForTitle = new Date(date + 'T00:00:00').toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-brand-text">Tomar Asistencia</h1>

            <Card>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Materia</label>
                        <select
                            id="subject"
                            value={selectedSubject}
                            onChange={(e) => setSelectedSubject(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 focus:border-brand-primary focus:ring-brand-primary"
                        >
                            <option value="" disabled>Seleccione una materia</option>
                            {professorSubjects.map(s => <option key={s.id} value={s.name}>{s.name} ({s.careerName})</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="date" className="block text-sm font-medium text-gray-700">Fecha</label>
                        <input
                            type="date"
                            id="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                        />
                    </div>
                </div>
            </Card>

            {selectedSubject && (
                isLoading ? <p>Cargando alumnos...</p> : (
                    <Card>
                        <h3 className="text-xl font-bold text-brand-text mb-2">Asistencia para {selectedSubject} - {formattedDateForTitle}</h3>
                        <div className="flex flex-wrap gap-2 my-4">
                            <Button onClick={() => markAll(AttendanceStatus.PRESENT)} variant="success" className="text-sm !py-1 !px-3">Marcar Todos Presentes</Button>
                            <Button onClick={() => markAll(AttendanceStatus.ABSENT)} variant="danger" className="text-sm !py-1 !px-3">Marcar Todos Ausentes</Button>
                        </div>
                        <div className="space-y-3">
                            {students.map(student => (
                                <div key={student.id} className="p-4 bg-gray-50 border rounded-lg flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                                    <p className="font-semibold text-brand-text">{student.name}</p>
                                    <div className="flex gap-2 flex-shrink-0">
                                        <Button onClick={() => handleStatusChange(student.id, AttendanceStatus.PRESENT)} variant={attendance[student.id] === AttendanceStatus.PRESENT ? 'success' : 'secondary'} className="text-sm !py-1 !px-3">Presente</Button>
                                        <Button onClick={() => handleStatusChange(student.id, AttendanceStatus.ABSENT)} variant={attendance[student.id] === AttendanceStatus.ABSENT ? 'danger' : 'secondary'} className="text-sm !py-1 !px-3">Ausente</Button>
                                        <Button onClick={() => handleStatusChange(student.id, AttendanceStatus.LATE)} variant={attendance[student.id] === AttendanceStatus.LATE ? 'warning' : 'secondary'} className="text-sm !py-1 !px-3">Tarde</Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 flex justify-end">
                            <Button onClick={handleSaveAttendance} disabled={students.length === 0}>Guardar Asistencia</Button>
                        </div>
                        {feedbackMessage && <p className="mt-4 text-green-600 font-semibold text-right">{feedbackMessage}</p>}
                    </Card>
                )
            )}
        </div>
    );
};

export default ProfessorAttendanceScreen;
