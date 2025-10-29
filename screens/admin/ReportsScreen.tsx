import React, { useState, useMemo, useEffect } from 'react';
import Card from '../../components/common/Card';
import * as api from '../../services/api';
import { SuggestionComplaint, SuggestionComplaintStatus, SuggestionComplaintType, User, UserRole } from '../../types';
import Button from '../../components/common/Button';

// Helper to get status styles
const getStatusStyles = (status: SuggestionComplaintStatus) => {
    switch (status) {
        case SuggestionComplaintStatus.NEW: return 'bg-blue-100 text-blue-800';
        case SuggestionComplaintStatus.READ: return 'bg-yellow-100 text-yellow-800';
        case SuggestionComplaintStatus.RESOLVED: return 'bg-green-100 text-green-800';
    }
};

// Helper to get type styles
const getTypeStyles = (type: SuggestionComplaintType) => {
    switch (type) {
        case SuggestionComplaintType.SUGGESTION: return 'bg-purple-100 text-purple-800';
        case SuggestionComplaintType.COMPLAINT: return 'bg-red-100 text-red-800';
    }
};

const SuggestionsScreen: React.FC = () => {
    const [suggestions, setSuggestions] = useState<SuggestionComplaint[]>([]);
    const [usersMap, setUsersMap] = useState<Map<string, User>>(new Map());
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ type: 'all', status: 'all' });

    const refreshSuggestions = async () => {
        setLoading(true);
        try {
            const [sugs, users] = await Promise.all([
                api.getSuggestionsComplaints(),
                api.getAllUsers()
            ]);
            setSuggestions(sugs);
            setUsersMap(new Map(users.map(u => [u.id, u])));
        } catch(error) {
            console.error("Failed to load suggestions:", error);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        refreshSuggestions();
    }, []);
    
    const handleStatusChange = async (id: string, status: SuggestionComplaintStatus) => {
        await api.updateSuggestionComplaintStatus(id, status);
        refreshSuggestions();
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const filteredSuggestions = useMemo(() => {
        return suggestions.filter(s => {
            const typeMatch = filters.type === 'all' || s.type === filters.type;
            const statusMatch = filters.status === 'all' || s.status === filters.status;
            return typeMatch && statusMatch;
        });
    }, [suggestions, filters]);
    
    if (loading) {
        return <div>Cargando...</div>
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-brand-text">Sugerencias y Quejas</h1>
            
            <Card>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <select name="type" value={filters.type} onChange={handleFilterChange} className="border-gray-300 rounded-md shadow-sm p-2">
                        <option value="all">Todos los tipos</option>
                        <option value={SuggestionComplaintType.SUGGESTION}>Sugerencias</option>
                        <option value={SuggestionComplaintType.COMPLAINT}>Quejas</option>
                    </select>
                    <select name="status" value={filters.status} onChange={handleFilterChange} className="border-gray-300 rounded-md shadow-sm p-2">
                        <option value="all">Todos los estados</option>
                        <option value={SuggestionComplaintStatus.NEW}>Nuevas</option>
                        <option value={SuggestionComplaintStatus.READ}>Leídas</option>
                        <option value={SuggestionComplaintStatus.RESOLVED}>Resueltas</option>
                    </select>
                </div>
            </Card>

            <div className="space-y-4">
                {filteredSuggestions.length > 0 ? filteredSuggestions.map(s => {
                    const user = usersMap.get(s.userId);
                    return (
                        <Card key={s.id}>
                            <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
                                <div className='flex-1'>
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getTypeStyles(s.type)}`}>{s.type}</span>
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusStyles(s.status)}`}>{s.status}</span>
                                    </div>
                                    <p className="text-gray-700 whitespace-pre-wrap">{s.text}</p>
                                </div>
                                <div className="md:text-right flex-shrink-0">
                                    <p className="font-semibold text-brand-text">{user?.name || 'Usuario desconocido'}</p>
                                    <p className="text-sm text-gray-500 capitalize">{user?.role}</p>
                                    <p className="text-sm text-gray-500 mt-1">{new Date(s.date + 'T00:00:00').toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div className="border-t mt-4 pt-4 flex justify-end gap-2">
                                <Button variant="secondary" onClick={() => handleStatusChange(s.id, SuggestionComplaintStatus.NEW)} disabled={s.status === SuggestionComplaintStatus.NEW} className="!py-1 !px-2 text-sm">Marcar Nueva</Button>
                                <Button variant="warning" onClick={() => handleStatusChange(s.id, SuggestionComplaintStatus.READ)} disabled={s.status === SuggestionComplaintStatus.READ} className="!py-1 !px-2 text-sm">Marcar Leída</Button>
                                <Button variant="success" onClick={() => handleStatusChange(s.id, SuggestionComplaintStatus.RESOLVED)} disabled={s.status === SuggestionComplaintStatus.RESOLVED} className="!py-1 !px-2 text-sm">Marcar Resuelta</Button>
                            </div>
                        </Card>
                    );
                }) : (
                    <Card>
                        <p className="text-center text-gray-500 py-8">No se encontraron sugerencias o quejas con los filtros aplicados.</p>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default SuggestionsScreen;
