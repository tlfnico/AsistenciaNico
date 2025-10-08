import React, { useState, useMemo, useEffect } from 'react';
import { mockApiService, students as allStudents } from '../../services/mockData';
import { Student, AttendanceStatus, AttendanceRecord } from '../../types';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Icon, { IconName } from '../../components/common/Icon';

type AttendanceState = { [studentId: string]: AttendanceStatus };

const getStatusStyles = (status?: AttendanceStatus) => {
    switch (status) {
        case AttendanceStatus.PRESENT:
            return { icon: 'check', color: 'text-green-600', bg: 'bg-green-100' };
        case AttendanceStatus.ABSENT:
            return { icon: 'delete', color: 'text-red-600', bg: 'bg-red-100' };
        case AttendanceStatus.LATE:
            return { icon: 'clock', color: 'text-yellow-600', bg: 'bg-yellow-100' };
        default:
            return { icon: 'minus', color: 'text-gray-400', bg: 'bg-gray-100' };
    }
};

const AttendanceReportGrid: React.FC<{ students: Student[]; subject: string; year: number; month: number; }> = ({ students, subject, year, month }) => {
    const [records, setRecords] = useState<AttendanceRecord[]>([]);

    useEffect(() => {
        const studentIds = students.map(s => s.id);
        const fetchedRecords = mockApiService.getMonthlyAttendanceForClass(studentIds, subject, year, month);
        setRecords(fetchedRecords);
    }, [students, subject, year, month]);

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    
    const recordsByStudentAndDate = useMemo(() => {
        const map = new Map<string, AttendanceStatus>();
        records.forEach(record => {
            const day = new Date(record.date + 'T00:00:00Z').getUTCDate();
            map.set(`${record.studentId}-${day}`, record.status);
        });
        return map;
    }, [records]);
    
    const summary = useMemo(() => {
        return records.reduce((acc, record) => {
            acc[record.status] = (acc[record.status] || 0) + 1;
            return acc;
        }, {} as Record<AttendanceStatus, number>);
    }, [records]);

    if (students.length === 0) {
        return <Card><p className="text-center text-gray-500">No hay alumnos para mostrar.</p></Card>;
    }

    return (
        <Card>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 z-10 whitespace-nowrap">Alumno</th>
                            {daysArray.map(day => (
                                <th key={day} className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                                   {String(day).padStart(2, '0')}/{String(month + 1).padStart(2, '0')}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                         {students.map(student => (
                            <tr key={student.id}>
                                <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900 sticky left-0 bg-white z-10">
                                    {student.name}
                                </td>
                                {daysArray.map(day => {
                                    const status = recordsByStudentAndDate.get(`${student.id}-${day}`);
                                    const styles = getStatusStyles(status);
                                    const iconName = styles.icon as IconName;
                                    return (
                                        <td key={`${student.id}-${day}`} className="text-center">
                                            <div className={`mx-auto rounded-full w-8 h-8 flex items-center justify-center ${styles.bg}`} title={status || 'Sin registro'}>
                                                <Icon name={iconName} className={`w-5 h-5 ${styles.color}`} />
                                            </div>
                                        </td>
                                    );
                                })}
                            </tr>
                         ))}
                    </tbody>
                </table>
            </div>
             <div className="mt-6 border-t pt-4">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Resumen del Mes</h4>
                <div className="flex flex-wrap gap-4 text-center">
                    <div className="p-3 bg-green-50 rounded-lg flex-1">
                        <p className="text-sm font-medium text-green-700">Presentes Totales</p>
                        <p className="text-2xl font-bold text-green-700">{summary[AttendanceStatus.PRESENT] || 0}</p>
                    </div>
                    <div className="p-3 bg-yellow-50 rounded-lg flex-1">
                        <p className="text-sm font-medium text-yellow-700">Tardanzas Totales</p>
                        <p className="text-2xl font-bold text-yellow-700">{summary[AttendanceStatus.LATE] || 0}</p>
                    </div>
                     <div className="p-3 bg-red-50 rounded-lg flex-1">
                        <p className="text-sm font-medium text-red-700">Ausencias Totales</p>
                        <p className="text-2xl font-bold text-red-700">{summary[AttendanceStatus.ABSENT] || 0}</p>
                    </div>
                </div>
            </div>
        </Card>
    );
};


const PreceptorAttendanceScreen: React.FC = () => {
    const [filters, setFilters] = useState({
        career: '',
        year: '',
        subject: '',
        date: new Date().toISOString().split('T')[0],
    });
    const [students, setStudents] = useState<Student[]>([]);
    const [attendance, setAttendance] = useState<AttendanceState>({});
    const [viewMode, setViewMode] = useState<'take' | 'report'>('take');
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [reportDate, setReportDate] = useState(new Date());

    const availableCareers = useMemo(() => mockApiService.getCareers().map(c => c.name), []);
    const availableYears = useMemo(() => [...new Set(allStudents.map(s => s.year))].sort(), []);
    const availableSubjects = useMemo(() => filters.career ? mockApiService.getSubjectsForCareer(filters.career) : [], [filters.career]);
    
    useEffect(() => {
        setReportDate(new Date(filters.date + 'T00:00:00'));
    }, [filters.date]);

    useEffect(() => {
        setFilters(f => ({ ...f, subject: '' }));
    }, [filters.career]);
    
    useEffect(() => {
        const { career, year, date, subject } = filters;
        if (career && year && date && subject) {
            setIsLoading(true);
            setTimeout(() => { 
                const yearAsNumber = parseInt(year, 10);
                const foundStudents = mockApiService.getStudentsByCareerAndYear(career, yearAsNumber);
                setStudents(foundStudents);
                
                const initialAttendance: AttendanceState = {};
                foundStudents.forEach(s => { initialAttendance[s.id] = AttendanceStatus.PRESENT; });
                setAttendance(initialAttendance);
                setIsLoading(false);
            }, 500);
        } else {
            setStudents([]);
        }
    }, [filters]);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
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
        if (!filters.subject.trim()) {
            alert('Por favor, ingrese el nombre de la materia.');
            return;
        }
        
        const recordsToSave = Object.keys(attendance).map(studentId => ({ studentId, status: attendance[studentId] }));
        mockApiService.saveAttendance(recordsToSave, filters.subject, filters.date);
        setFeedbackMessage('¡Asistencia guardada con éxito!');
        setTimeout(() => {
            setFeedbackMessage('');
        }, 3000);
    };

    const handleMonthChange = (offset: number) => {
        setReportDate(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(newDate.getMonth() + offset, 1);
            return newDate;
        });
    };

    const formattedDateForTitle = new Date(filters.date + 'T00:00:00').toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const isFilterComplete = filters.career && filters.year && filters.subject;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-brand-text">Gestión de Asistencia</h1>

            <Card>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <SelectInput label="Carrera" name="career" value={filters.career} onChange={handleFilterChange} options={availableCareers.map(c => ({ value: c, label: c }))} placeholder="Seleccione carrera" />
                    <SelectInput label="Año" name="year" value={filters.year} onChange={handleFilterChange} options={availableYears.map(y => ({ value: String(y), label: `${y}° Año` }))} placeholder="Seleccione año" disabled={!filters.career} />
                    <SelectInput label="Materia" name="subject" value={filters.subject} onChange={handleFilterChange} options={availableSubjects.map(s => ({ value: s, label: s }))} placeholder="Seleccione materia" disabled={!availableSubjects.length} />
                    <div>
                        <label htmlFor="date" className="block text-sm font-medium text-gray-700">Fecha de Asistencia</label>
                        <input type="date" name="date" value={filters.date} onChange={handleFilterChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 focus:border-brand-primary focus:ring-brand-primary" />
                    </div>
                </div>
            </Card>

            {isFilterComplete && (
                <div>
                     <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold text-brand-text">{filters.subject}</h2>
                        <div className="flex items-center gap-2 p-1 bg-gray-200 rounded-full">
                            <button onClick={() => setViewMode('take')} className={`px-4 py-1 rounded-full text-sm font-semibold transition-colors ${viewMode === 'take' ? 'bg-white text-brand-primary shadow' : 'text-gray-600'}`}>Tomar Asistencia</button>
                            <button onClick={() => setViewMode('report')} className={`px-4 py-1 rounded-full text-sm font-semibold transition-colors ${viewMode === 'report' ? 'bg-white text-brand-primary shadow' : 'text-gray-600'}`}>Reporte Mensual</button>
                        </div>
                    </div>
                    {isLoading ? <p>Cargando alumnos...</p> : (
                         viewMode === 'take' ? (
                            <Card>
                                <h3 className="text-xl font-bold text-brand-text mb-2">Asistencia para el {formattedDateForTitle}</h3>
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
                         ) : (
                            <>
                                <div className="flex items-center justify-center gap-4 mb-4">
                                    <Button onClick={() => handleMonthChange(-1)} aria-label="Mes anterior">
                                        &lt;
                                    </Button>
                                    <h3 className="text-xl font-bold text-center capitalize text-brand-text w-48">
                                        {reportDate.toLocaleString('es-ES', { month: 'long', year: 'numeric' })}
                                    </h3>
                                    <Button onClick={() => handleMonthChange(1)} aria-label="Mes siguiente">
                                        &gt;
                                    </Button>
                                </div>
                                <AttendanceReportGrid students={students} subject={filters.subject} year={reportDate.getFullYear()} month={reportDate.getMonth()} />
                            </>
                         )
                    )}
                </div>
            )}
        </div>
    );
};

const SelectInput: React.FC<{ label: string, name: string, value: string, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void, options: { value: string, label: string }[], placeholder: string, disabled?: boolean }> = 
({ label, name, value, onChange, options, placeholder, disabled }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
        <select id={name} name={name} value={value} onChange={onChange} disabled={disabled} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 focus:border-brand-primary focus:ring-brand-primary disabled:bg-gray-100">
            <option value="" disabled>{placeholder}</option>
            {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
    </div>
);

export default PreceptorAttendanceScreen;