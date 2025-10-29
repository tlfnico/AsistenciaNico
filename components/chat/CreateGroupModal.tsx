import React, { useState, useMemo, useEffect } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import { User, Career, Student } from '../../types';
import * as api from '../../services/api';

interface CreateGroupModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (name: string, participantIds: string[]) => void;
    currentUser: User;
}

const CreateGroupModal: React.FC<CreateGroupModalProps> = ({ isOpen, onClose, onCreate, currentUser }) => {
    const [groupName, setGroupName] = useState('');
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [searchTerm, setSearchTerm] = useState('');
    const [allCareers, setAllCareers] = useState<Career[]>([]);
    const [potentialParticipants, setPotentialParticipants] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (isOpen) {
                setLoading(true);
                setGroupName('');
                setSelectedIds(new Set());
                setSearchTerm('');
                try {
                    const [careers, users] = await Promise.all([
                        api.getCareers(),
                        api.getAllUsers()
                    ]);
                    setAllCareers(careers);
                    setPotentialParticipants(users.filter(u => u.id !== currentUser.id));
                } catch(error) {
                    console.error("Failed to load data for group modal", error);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchData();
    }, [isOpen, currentUser]);

    if (!isOpen) return null;
    
    const handleCareerToggle = (careerName: string, isChecked: boolean) => {
        const newSelectedIds = new Set(selectedIds);
        const studentsInCareer = potentialParticipants.filter(p => p.role === 'student' && (p as Student).careers.includes(careerName));

        studentsInCareer.forEach(student => {
            if (isChecked) {
                newSelectedIds.add(student.id);
            } else {
                newSelectedIds.delete(student.id);
            }
        });
        setSelectedIds(newSelectedIds);
    };

    const handleIndividualToggle = (userId: string) => {
        const newSelectedIds = new Set(selectedIds);
        if (newSelectedIds.has(userId)) {
            newSelectedIds.delete(userId);
        } else {
            newSelectedIds.add(userId);
        }
        setSelectedIds(newSelectedIds);
    };

    const handleCreateClick = () => {
        if (groupName.trim() && selectedIds.size > 0) {
            onCreate(groupName.trim(), Array.from(selectedIds));
        } else {
            alert('Por favor, ingrese un nombre para el grupo y seleccione al menos un participante.');
        }
    };
    
    const filteredParticipants = useMemo(() => {
        return potentialParticipants.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [potentialParticipants, searchTerm]);
    
    // Determine if a career is fully or partially selected
    const getCareerSelectionState = (careerName: string) => {
        const studentsInCareer = potentialParticipants.filter(p => p.role === 'student' && (p as Student).careers.includes(careerName));
        if (studentsInCareer.length === 0) return 'none';

        const selectedCount = studentsInCareer.filter(s => selectedIds.has(s.id)).length;
        
        if (selectedCount === 0) return 'none';
        if (selectedCount === studentsInCareer.length) return 'all';
        return 'partial';
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={onClose}>
            <Card className="w-11/12 max-w-2xl flex flex-col" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-bold text-brand-text mb-4">Crear Nuevo Grupo</h2>
                <input
                    type="text"
                    placeholder="Nombre del grupo..."
                    value={groupName}
                    onChange={e => setGroupName(e.target.value)}
                    className="w-full border-gray-300 rounded-md shadow-sm p-2 mb-4"
                />
                
                {loading ? <p>Cargando participantes...</p> :
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto">
                    {/* Career Selection */}
                    <div className="flex flex-col">
                        <h3 className="font-semibold text-gray-700 mb-2">Añadir por Carrera</h3>
                        <div className="space-y-2 p-2 border rounded-md overflow-y-auto">
                           {allCareers.map(career => {
                               const selectionState = getCareerSelectionState(career.name);
                               return (
                                <div key={career.id} className="p-2 hover:bg-gray-100 rounded-lg flex items-center">
                                    <input
                                        type="checkbox"
                                        id={`career-${career.id}`}
                                        checked={selectionState === 'all'}
                                        ref={el => {
                                            if (el) {
                                                el.indeterminate = selectionState === 'partial';
                                            }
                                        }}
                                        onChange={e => handleCareerToggle(career.name, e.target.checked)}
                                        className="h-4 w-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
                                    />
                                    <label htmlFor={`career-${career.id}`} className="ml-3 text-sm font-medium text-gray-700 cursor-pointer">{career.name}</label>
                                </div>
                           )})}
                        </div>
                    </div>
                    {/* Individual Selection */}
                    <div className="flex flex-col">
                         <h3 className="font-semibold text-gray-700 mb-2">Añadir Individualmente</h3>
                         <input
                            type="text"
                            placeholder="Buscar participantes..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full border-gray-300 rounded-md shadow-sm p-2 mb-2"
                        />
                        <div className="space-y-1 p-2 border rounded-md overflow-y-auto">
                            {filteredParticipants.map(user => (
                                <div key={user.id} onClick={() => handleIndividualToggle(user.id)} className="p-2 hover:bg-gray-100 cursor-pointer rounded-lg flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.has(user.id)}
                                        readOnly
                                        className="h-4 w-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
                                    />
                                    <div>
                                        <p className="font-semibold text-brand-text text-sm">{user.name}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                }

                <div className="mt-4 pt-4 border-t flex justify-between items-center">
                    <p className="text-sm font-semibold text-gray-600">{selectedIds.size} participante(s) seleccionado(s)</p>
                    <div className="flex gap-2">
                        <Button variant="secondary" onClick={onClose}>Cancelar</Button>
                        <Button onClick={handleCreateClick} disabled={!groupName.trim() || selectedIds.size === 0}>Crear Grupo</Button>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default CreateGroupModal;
