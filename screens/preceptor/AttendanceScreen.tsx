
import React, { useState, useMemo } from 'react';
import { mockApiService, students as allStudents } from '../../services/mockData';
import { Student, AttendanceStatus } from '../../types';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

type AttendanceState = { [studentId: string]: AttendanceStatus };

const PreceptorAttendanceScreen: React.FC = () => {
    const [step, setStep] = useState(1);
    const [selectedCareer, setSelectedCareer] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [students, setStudents] = useState<Student[]>([]);
    const [attendance, setAttendance] = useState<AttendanceState>({});
    const [subject, setSubject] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [feedbackMessage, setFeedbackMessage] = useState('');

    const availableCareers = useMemo(() => [...new Set(allStudents.flatMap(s => s.careers))], []);
    const availableYears = useMemo(() => [...new Set(allStudents.map(s => s.year))].sort(), []);

    const handleSearchStudents = () => {
        if (!selectedCareer || !selectedYear || !selectedDate) {
            alert("Por favor, seleccione fecha, carrera y año.");
            return;
        }
        const yearAsNumber = parseInt(selectedYear, 10);
        const foundStudents = mockApiService.getStudentsByCareerAndYear(selectedCareer, yearAsNumber);
        setStudents(foundStudents);
        
        const initialAttendance: AttendanceState = {};
        foundStudents.forEach(s => { initialAttendance[s.id] = AttendanceStatus.PRESENT; });
        setAttendance(initialAttendance);
        
        setStep(2);
    };
    
    const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
        setAttendance(prev => ({...prev, [studentId]: status}));
    };
    
    const markAll = (status: AttendanceStatus) => {
        const newAttendance: AttendanceState = {};
        students.forEach(s => { newAttendance[s.id] = status; });
        setAttendance(newAttendance);
    };

    const handleSaveAttendance = () => {
        if (!subject.trim()) {
            alert('Por favor, ingrese el nombre de la materia.');
            return;
        }
        
        const recordsToSave = Object.keys(attendance).map(studentId => ({ studentId, status: attendance[studentId] }));
        mockApiService.saveAttendance(recordsToSave, subject, selectedDate);
        setFeedbackMessage('¡Asistencia guardada con éxito!');
        setTimeout(() => {
            setFeedbackMessage('');
            setStep(1);
            setSubject('');
            setSelectedCareer('');
            setSelectedYear('');
            setSelectedDate(new Date().toISOString().split('T')[0]);
        }, 3000);
    };

    const handleGoBack = () => {
        setStep(1);
        setStudents([]);
        setAttendance({});
        setSubject('');
    };

    const formattedDateForTitle = new Date(selectedDate + 'T00:00:00').toLocaleDateString('es-ES');

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-brand-text">Tomar Asistencia</h1>

            {step === 1 && (
                <Card>
                    <h2 className="text-xl font-bold text-brand-text mb-4">Paso 1: Seleccionar Curso</h2>
                    <div className="space-y-4 mb-6">
                         <div>
                            <label htmlFor="date" className="block text-sm font-medium text-gray-700">Fecha</label>
                            <input
                                type="date"
                                id="date"
                                value={selectedDate}
                                onChange={e => setSelectedDate(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-sm p-2"
                            />
                        </div>
                        <div>
                            <label htmlFor="career" className="block text-sm font-medium text-gray-700">Carrera</label>
                            <select
                                id="career"
                                value={selectedCareer}
                                onChange={e => setSelectedCareer(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-sm p-2"
                            >
                                <option value="" disabled>Seleccione una carrera</option>
                                {availableCareers.map(career => <option key={career} value={career}>{career}</option>)}
                            </select>
                        </div>
                         <div>
                            <label htmlFor="year" className="block text-sm font-medium text-gray-700">Año</label>
                            <select
                                id="year"
                                value={selectedYear}
                                onChange={e => setSelectedYear(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-sm p-2"
                            >
                                <option value="" disabled>Seleccione un año</option>
                                {availableYears.map(year => <option key={year} value={year}>{year}° Año</option>)}
                            </select>
                        </div>
                    </div>
                    <Button onClick={handleSearchStudents}>Buscar Alumnos</Button>
                </Card>
            )}

            {step === 2 && (
                <Card>
                    <h2 className="text-xl font-bold text-brand-text mb-2">
                        Paso 2: Marcar Asistencia ({formattedDateForTitle})
                    </h2>
                    <p className="text-md text-gray-600 mb-4">{selectedCareer} - {selectedYear}° Año</p>

                    <div className="mb-4">
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Materia</label>
                        <input
                            type="text"
                            id="subject"
                            value={subject}
                            onChange={e => setSubject(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-sm p-2"
                            placeholder="Ej: Análisis Matemático III"
                        />
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                        <Button onClick={() => markAll(AttendanceStatus.PRESENT)} variant="success">Marcar Todos Presentes</Button>
                        <Button onClick={() => markAll(AttendanceStatus.ABSENT)} variant="danger">Marcar Todos Ausentes</Button>
                    </div>

                    <div className="space-y-3">
                        {students.length > 0 ? students.map(student => (
                            <div key={student.id} className="p-4 bg-gray-50 border border-gray-200 rounded-lg flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                                <p className="font-semibold text-brand-text">{student.name}</p>
                                <div className="flex gap-2 flex-shrink-0">
                                    <Button onClick={() => handleStatusChange(student.id, AttendanceStatus.PRESENT)} variant={attendance[student.id] === AttendanceStatus.PRESENT ? 'success' : 'secondary'} className="text-sm !py-1 !px-3">Presente</Button>
                                    <Button onClick={() => handleStatusChange(student.id, AttendanceStatus.ABSENT)} variant={attendance[student.id] === AttendanceStatus.ABSENT ? 'danger' : 'secondary'} className="text-sm !py-1 !px-3">Ausente</Button>
                                    <Button onClick={() => handleStatusChange(student.id, AttendanceStatus.LATE)} variant={attendance[student.id] === AttendanceStatus.LATE ? 'warning' : 'secondary'} className="text-sm !py-1 !px-3">Tarde</Button>
                                </div>
                            </div>
                        )) : <p className="text-gray-500">No se encontraron alumnos para los criterios seleccionados.</p>}
                    </div>
                    
                    <div className="mt-6 flex justify-between items-center">
                        <Button onClick={handleGoBack} variant="secondary">Volver</Button>
                        <Button onClick={handleSaveAttendance} disabled={students.length === 0}>Guardar Asistencia</Button>
                    </div>

                    {feedbackMessage && <p className="mt-4 text-green-600 font-semibold">{feedbackMessage}</p>}
                </Card>
            )}
        </div>
    );
};

export default PreceptorAttendanceScreen;
