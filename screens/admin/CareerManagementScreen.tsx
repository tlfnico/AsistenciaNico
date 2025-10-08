import React, { useState, useMemo } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Icon from '../../components/common/Icon';
import { mockApiService } from '../../services/mockData';
import { Career, Subject } from '../../types';

const CareerFormModal: React.FC<{
    career: Partial<Career> | null;
    onClose: () => void;
    onSave: () => void;
}> = ({ career, onClose, onSave }) => {
    const [name, setName] = useState(career?.name || '');
    const [subjects, setSubjects] = useState<Subject[]>(career?.subjects || []);
    const [newSubject, setNewSubject] = useState({ name: '', year: 1 });

    const handleAddSubject = () => {
        if (newSubject.name.trim() && newSubject.year > 0) {
            setSubjects([...subjects, { id: `s-${Date.now()}`, ...newSubject }]);
            setNewSubject({ name: '', year: 1 });
        }
    };

    const handleRemoveSubject = (subjectId: string) => {
        setSubjects(subjects.filter(s => s.id !== subjectId));
    };

    const handleSubmit = () => {
        if (!name.trim()) return;

        const careerData = {
            id: career?.id || '',
            name: name.trim(),
            subjects
        };

        if (career?.id) {
            mockApiService.updateCareer(careerData);
        } else {
            mockApiService.addCareer({ name: careerData.name, subjects: careerData.subjects });
        }
        onSave();
    };
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={onClose}>
            <Card className="w-11/12 max-w-lg" onClick={e => e.stopPropagation()}>
                <h3 className="text-2xl font-bold mb-6 text-brand-text">{career?.id ? 'Editar' : 'Nueva'} Carrera</h3>
                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-gray-700">Nombre de la Carrera</label>
                        <input value={name} onChange={(e) => setName(e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm p-2 mt-1" />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700">Materias</label>
                        <div className="flex gap-2 mt-1 items-end">
                            <div className="flex-grow">
                                <label className="text-xs">Nombre de Materia</label>
                                <input value={newSubject.name} onChange={(e) => setNewSubject(s => ({...s, name: e.target.value}))} placeholder="Añadir materia..." className="w-full border-gray-300 rounded-md shadow-sm p-2" />
                            </div>
                            <div className="w-20">
                                 <label className="text-xs">Año</label>
                                <input type="number" min="1" max="6" value={newSubject.year} onChange={(e) => setNewSubject(s => ({...s, year: parseInt(e.target.value, 10) || 1}))} className="w-full border-gray-300 rounded-md shadow-sm p-2" />
                            </div>
                            <Button onClick={handleAddSubject} className="h-10">Añadir</Button>
                        </div>
                        <div className="mt-2 space-y-2 max-h-40 overflow-y-auto p-1">
                            {subjects.sort((a,b) => a.year - b.year).map(s => (
                                <div key={s.id} className="flex justify-between items-center bg-gray-100 p-2 rounded-md">
                                    <span className="text-sm font-semibold">{s.name}</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold text-gray-500 bg-white px-2 py-1 rounded-full">{s.year}° Año</span>
                                        <button onClick={() => handleRemoveSubject(s.id)} className="text-red-500 hover:text-red-700">
                                            <Icon name="delete" className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="mt-6 flex justify-end gap-2">
                    <Button variant="secondary" onClick={onClose}>Cancelar</Button>
                    <Button onClick={handleSubmit}>Guardar</Button>
                </div>
            </Card>
        </div>
    );
};


const CareerManagementScreen: React.FC = () => {
    const [allCareers, setAllCareers] = useState(() => mockApiService.getCareers());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCareer, setEditingCareer] = useState<Career | null>(null);
    const [filters, setFilters] = useState({ name: '', year: '', subject: '' });

    const refreshCareers = () => {
        setAllCareers(mockApiService.getCareers());
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const filteredCareers = useMemo(() => {
        return allCareers.filter(career => {
            const nameMatch = filters.name === '' || career.name.toLowerCase().includes(filters.name.toLowerCase());
            const yearMatch = filters.year === '' || career.subjects.some(s => s.year === parseInt(filters.year, 10));
            const subjectMatch = filters.subject === '' || career.subjects.some(s => s.name.toLowerCase().includes(filters.subject.toLowerCase()));
            return nameMatch && yearMatch && subjectMatch;
        });
    }, [allCareers, filters]);

    const handleOpenModal = (career: Career | null = null) => {
        setEditingCareer(career);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingCareer(null);
    };

    const handleSave = () => {
        refreshCareers();
        handleCloseModal();
    };
    
    const handleDelete = (careerId: string) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar esta carrera? Esta acción no se puede deshacer.')) {
            mockApiService.deleteCareer(careerId);
            refreshCareers();
        }
    };
    
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-brand-text">Gestión de Carreras</h1>
                <Button onClick={() => handleOpenModal()}>
                    <div className="flex items-center gap-2">
                        <Icon name="plus" className="w-5 h-5"/>
                        <span>Nueva Carrera</span>
                    </div>
                </Button>
            </div>

            <Card>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input type="text" name="name" placeholder="Buscar por carrera..." value={filters.name} onChange={handleFilterChange} className="border-gray-300 rounded-md shadow-sm p-2" />
                    <select name="year" value={filters.year} onChange={handleFilterChange} className="border-gray-300 rounded-md shadow-sm p-2">
                        <option value="">Filtrar por año</option>
                        {[1, 2, 3, 4, 5, 6].map(y => <option key={y} value={y}>{y}° Año</option>)}
                    </select>
                    <input type="text" name="subject" placeholder="Buscar por materia..." value={filters.subject} onChange={handleFilterChange} className="border-gray-300 rounded-md shadow-sm p-2" />
                </div>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCareers.map(career => {
                    const subjectsByYear = career.subjects.reduce((acc, subject) => {
                        const year = subject.year;
                        if (!acc[year]) {
                            acc[year] = [];
                        }
                        acc[year].push(subject);
                        return acc;
                    }, {} as Record<number, Subject[]>);

                    return (
                    <Card key={career.id} className="flex flex-col">
                        <div className="flex-grow">
                            <h2 className="text-xl font-bold text-brand-primary">{career.name}</h2>
                            <div className="mt-4 space-y-3">
                                {/* Fix: Simplify the sort callback to avoid TypeScript inference issues. */}
                                {Object.entries(subjectsByYear).sort((a, b) => parseInt(a[0], 10) - parseInt(b[0], 10)).map(([year, subjects]) => (
                                    <div key={year}>
                                        <h3 className="text-sm font-semibold text-gray-600 mb-1">{year}° Año</h3>
                                        <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                                            {(subjects as Subject[]).map(s => <li key={s.id}>{s.name}</li>)}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </div>
                         <div className="mt-6 border-t pt-4 flex justify-end gap-2">
                            <Button variant="secondary" onClick={() => handleOpenModal(career)}>Editar</Button>
                            <Button variant="danger" onClick={() => handleDelete(career.id)}>Eliminar</Button>
                        </div>
                    </Card>
                    );
                })}
            </div>
            
            {filteredCareers.length === 0 && (
                <Card>
                    <p className="text-center text-gray-500 py-8">No se encontraron carreras con los filtros aplicados.</p>
                </Card>
            )}

            {isModalOpen && <CareerFormModal career={editingCareer} onClose={handleCloseModal} onSave={handleSave} />}
        </div>
    );
};

export default CareerManagementScreen;