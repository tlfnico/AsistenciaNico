
import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../hooks/useAuth';
import * as api from '../../services/api';
import { AttendanceRecord, AttendanceStatus } from '../../types';
import Card from '../../components/common/Card';
import AttendanceChart from '../../components/attendance/AttendanceChart';

const getStatusDotClasses = (status: AttendanceStatus) => {
    switch (status) {
        case AttendanceStatus.PRESENT:
            return 'bg-green-500';
        case AttendanceStatus.ABSENT:
            return 'bg-red-500';
        case AttendanceStatus.LATE:
            return 'bg-yellow-500';
        default:
            return 'bg-gray-300';
    }
};

const AttendanceCalendar: React.FC<{ records: AttendanceRecord[] }> = ({ records }) => {
    const [currentDate, setCurrentDate] = useState(() => {
        if (!records || records.length === 0) {
            return new Date();
        }
        const latestRecordDate = records.reduce((max, record) => 
            new Date(record.date) > new Date(max.date) ? record : max
        ).date;
        return new Date(latestRecordDate + 'T00:00:00');
    });
    
    const [selectedRecord, setSelectedRecord] = useState<AttendanceRecord | null>(null);

    const recordsByDate = useMemo(() => {
        return records.reduce((acc, record) => {
            acc[record.date] = record;
            return acc;
        }, {} as { [date: string]: AttendanceRecord });
    }, [records]);

    const changeMonth = (offset: number) => {
        setCurrentDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() + offset, 1));
        setSelectedRecord(null); // Clear selection when changing month
    };

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startDayOfWeek = firstDayOfMonth.getDay(); 
    const monthName = firstDayOfMonth.toLocaleString('es-ES', { month: 'long', year: 'numeric' });

    const handleDayClick = (record: AttendanceRecord | undefined) => {
        if (record) {
            setSelectedRecord(prev => prev?.id === record.id ? null : record);
        }
    };

    return (
        <div className="mt-6">
            <h3 className="text-md font-semibold text-gray-700 mb-2">Historial de Asistencia:</h3>
            <div className="p-3 border rounded-lg bg-gray-50">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-1 sm:gap-2">
                        <button onClick={() => changeMonth(-12)} className="p-2 rounded-full hover:bg-gray-200 transition-colors" aria-label="Año anterior">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" /></svg>
                        </button>
                        <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-gray-200 transition-colors" aria-label="Mes anterior">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                        </button>
                    </div>
                    <h4 className="text-base sm:text-lg font-bold text-center capitalize text-brand-text">{monthName}</h4>
                    <div className="flex items-center gap-1 sm:gap-2">
                        <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-gray-200 transition-colors" aria-label="Mes siguiente">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        </button>
                         <button onClick={() => changeMonth(12)} className="p-2 rounded-full hover:bg-gray-200 transition-colors" aria-label="Año siguiente">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center text-xs sm:text-sm">
                    {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => <div key={day} className="font-medium text-gray-500 py-1">{day}</div>)}
                    {Array.from({ length: startDayOfWeek }).map((_, i) => <div key={`blank-${i}`}></div>)}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                        const day = i + 1;
                        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                        const record = recordsByDate[dateStr];
                        const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();
                        const isSelected = selectedRecord?.date === dateStr;
                        
                        const dayContainerClasses = [
                            'relative', 'flex', 'items-center', 'justify-center', 'h-9', 'w-9', 'mx-auto',
                            'rounded-full', 'transition-all', 'duration-150',
                            isToday ? 'bg-blue-100' : '',
                            record ? 'cursor-pointer hover:bg-gray-200' : '',
                            isSelected ? 'border-2 border-brand-primary' : ''
                        ].filter(Boolean).join(' ');

                        let dayNumberClasses;
                        if (isToday) {
                            dayNumberClasses = 'font-extrabold text-brand-primary';
                        } else if (record) {
                            dayNumberClasses = 'font-bold text-gray-800';
                        } else {
                            dayNumberClasses = 'text-gray-500';
                        }

                        return (
                            <div key={day} className={dayContainerClasses} onClick={() => handleDayClick(record)}>
                                <span className={dayNumberClasses}>{day}</span>
                                {record && (
                                    <div title={record.status} className={`absolute bottom-1 w-1.5 h-1.5 rounded-full ${getStatusDotClasses(record.status)}`}></div>
                                )}
                            </div>
                        );
                    })}
                </div>
                 {selectedRecord && (
                    <div className="mt-4 p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                        <h4 className="text-sm font-semibold text-brand-text">Detalle del Día</h4>
                        <p className="text-sm text-gray-600">
                            <strong>Fecha:</strong> {new Date(selectedRecord.date + 'T00:00:00').toLocaleDateString('es-ES')}
                        </p>
                        <p className="text-sm text-gray-600">
                            <strong>Estado:</strong> {selectedRecord.status}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};


const StudentAttendanceScreen: React.FC = () => {
    const { user } = useAuth();
    const [records, setRecords] = useState<AttendanceRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedSubject, setSelectedSubject] = useState<string>('all');
    
    useEffect(() => {
        const fetchAttendance = async () => {
            if (user) {
                try {
                    setLoading(true);
                    const data = await api.getStudentAttendance(user.id);
                    setRecords(data);
                } catch (error) {
                    console.error("Error fetching attendance", error);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchAttendance();
    }, [user]);

    const recordsBySubject = useMemo(() => {
        return records.reduce((acc, record) => {
            const subject = record.subject;
            if (!acc[subject]) {
                acc[subject] = [];
            }
            acc[subject].push(record);
            return acc;
        }, {} as { [subject: string]: AttendanceRecord[] });
    }, [records]);
    
    const allSubjects = useMemo(() => Object.keys(recordsBySubject).sort(), [recordsBySubject]);

    const subjectEntriesToRender: [string, AttendanceRecord[]][] = useMemo(() => {
        if (selectedSubject === 'all') {
            return Object.entries(recordsBySubject);
        }
        if (recordsBySubject[selectedSubject]) {
            return [[selectedSubject, recordsBySubject[selectedSubject]]];
        }
        return [];
    }, [recordsBySubject, selectedSubject]);

    if(loading) {
        return <div>Cargando asistencia...</div>
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-brand-text">Mi Asistencia</h1>

            {allSubjects.length > 1 && (
                <Card>
                    <div className="flex flex-wrap items-center gap-2">
                         <span className="font-semibold text-gray-700 mr-2">Filtrar por materia:</span>
                         <button
                            onClick={() => setSelectedSubject('all')}
                            className={`px-3 py-1 text-sm font-semibold rounded-full transition-colors ${selectedSubject === 'all' ? 'bg-brand-primary text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                         >
                             Todas
                         </button>
                        {allSubjects.map(subject => (
                             <button
                                key={subject}
                                onClick={() => setSelectedSubject(subject)}
                                className={`px-3 py-1 text-sm font-semibold rounded-full transition-colors ${selectedSubject === subject ? 'bg-brand-primary text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                             >
                                 {subject}
                             </button>
                        ))}
                    </div>
                </Card>
            )}

            {subjectEntriesToRender.length > 0 ? (
                subjectEntriesToRender.map(([subject, subjectRecords]) => {
                    const totalClasses = subjectRecords.length;
                    const present = subjectRecords.filter(r => r.status === AttendanceStatus.PRESENT).length;
                    const late = subjectRecords.filter(r => r.status === AttendanceStatus.LATE).length;
                    const absent = totalClasses - present - late;
                    const attendancePercentage = totalClasses > 0 ? Math.round(((present + late) / totalClasses) * 100) : 0;
                    
                    let chartColor = '#16a34a'; // green-600
                    if (attendancePercentage < 75) chartColor = '#ca8a04'; // yellow-600
                    if (attendancePercentage < 50) chartColor = '#dc2626'; // red-600

                    return (
                        <Card key={subject}>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mb-6">
                                <div className="flex-shrink-0 mx-auto sm:mx-0">
                                    <AttendanceChart percentage={attendancePercentage} color={chartColor} />
                                </div>
                                <div className="flex-1 w-full">
                                    <h2 className="text-2xl font-bold text-brand-text mb-4 text-center sm:text-left">{subject}</h2>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                                        <div className="p-2 bg-gray-50 rounded-lg">
                                            <p className="text-sm font-medium text-gray-500">Clases</p>
                                            <p className="text-2xl font-bold text-brand-text">{totalClasses}</p>
                                        </div>
                                        <div className="p-2 bg-green-50 rounded-lg">
                                            <p className="text-sm font-medium text-green-700">Presente</p>
                                            <p className="text-2xl font-bold text-green-700">{present}</p>
                                        </div>
                                        <div className="p-2 bg-yellow-50 rounded-lg">
                                            <p className="text-sm font-medium text-yellow-700">Tardes</p>
                                            <p className="text-2xl font-bold text-yellow-700">{late}</p>
                                        </div>
                                        <div className="p-2 bg-red-50 rounded-lg">
                                            <p className="text-sm font-medium text-red-700">Ausente</p>
                                            <p className="text-2xl font-bold text-red-700">{absent}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <AttendanceCalendar records={subjectRecords} />

                        </Card>
                    );
                })
            ) : (
                <Card>
                    <p className="text-center text-gray-500">
                         {selectedSubject === 'all' 
                            ? 'No tienes registros de asistencia todavía.' 
                            : 'No se encontraron registros de asistencia para la materia seleccionada.'
                         }
                    </p>
                </Card>
            )}
        </div>
    );
};

export default StudentAttendanceScreen;
