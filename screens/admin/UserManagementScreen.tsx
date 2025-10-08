import React, { useState, useMemo, useEffect } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Icon from '../../components/common/Icon';
import { mockApiService } from '../../services/mockData';
import { User, UserRole, Student, Preceptor, Admin, Career } from '../../types';

const getRoleBadge = (role: UserRole) => {
    switch(role) {
        case UserRole.STUDENT: return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Alumno</span>;
        case UserRole.PRECEPTOR: return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">Preceptor</span>;
        case UserRole.ADMIN: return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Admin</span>;
    }
};

const UserFormModal: React.FC<{
    user: Partial<Student & Preceptor & Admin> | null;
    onClose: () => void;
    onSave: () => void;
}> = ({ user, onClose, onSave }) => {
    
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        role: user?.role || UserRole.STUDENT,
        dni: (user as Student)?.dni || '',
        year: (user as Student)?.year || 1,
        careers: (user as Student)?.careers || []
    });
    
    const availableCareers = useMemo(() => mockApiService.getCareers(), []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCareerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { value } = e.target;
        setFormData(prev => ({ ...prev, careers: value ? [value] : [] }));
    };

    const handleSubmit = () => {
        if (!formData.name.trim() || !formData.email.trim()) {
            alert('Nombre y Email son requeridos.');
            return;
        }

        let userData: Student | Preceptor | Admin;

        if (formData.role === UserRole.STUDENT) {
            userData = {
                id: user?.id || '',
                name: formData.name,
                email: formData.email,
                role: UserRole.STUDENT,
                dni: formData.dni || '',
                year: Number(formData.year) || 1,
                careers: formData.careers || []
            };
        } else {
            userData = {
                id: user?.id || '',
                name: formData.name,
                email: formData.email,
                role: formData.role,
            };
        }

        if (user?.id) {
            mockApiService.updateUser(userData as User);
        } else {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { id, ...newUser } = userData;
            mockApiService.addUser(newUser);
        }
        onSave();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={onClose}>
            <Card className="w-11/12 max-w-lg" onClick={e => e.stopPropagation()}>
                <h3 className="text-2xl font-bold mb-6 text-brand-text">{user?.id ? 'Editar' : 'Nuevo'} Usuario</h3>
                <div className="space-y-4">
                    <InputField label="Nombre Completo" name="name" value={formData.name} onChange={handleChange} />
                    <InputField label="Email" name="email" value={formData.email} onChange={handleChange} type="email" />
                     <div>
                        <label className="text-sm font-medium text-gray-700">Rol</label>
                        <select name="role" value={formData.role} onChange={handleChange} className="w-full border-gray-300 rounded-md shadow-sm p-2 mt-1">
                            <option value={UserRole.STUDENT}>Alumno</option>
                            <option value={UserRole.PRECEPTOR}>Preceptor</option>
                            <option value={UserRole.ADMIN}>Admin</option>
                        </select>
                    </div>
                    {formData.role === UserRole.STUDENT && (
                        <>
                           <InputField label="DNI" name="dni" value={formData.dni} onChange={handleChange} />
                           <div>
                                <label className="text-sm font-medium text-gray-700">Carrera</label>
                                <select
                                    name="careers"
                                    value={formData.careers[0] || ''}
                                    onChange={handleCareerChange}
                                    className="w-full border-gray-300 rounded-md shadow-sm p-2 mt-1"
                                >
                                    <option value="">Seleccione una carrera</option>
                                    {availableCareers.map(career => (
                                        <option key={career.id} value={career.name}>
                                            {career.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </>
                    )}
                </div>
                 <div className="mt-6 flex justify-end gap-2">
                    <Button variant="secondary" onClick={onClose}>Cancelar</Button>
                    <Button onClick={handleSubmit}>Guardar</Button>
                </div>
            </Card>
        </div>
    );
};

const InputField: React.FC<{label: string, name: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, type?: string}> = 
({ label, name, value, onChange, type = 'text' }) => (
    <div>
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <input name={name} value={value} onChange={onChange} type={type} className="w-full border-gray-300 rounded-md shadow-sm p-2 mt-1" />
    </div>
);


const UserManagementScreen: React.FC = () => {
    const [allUsers, setAllUsers] = useState(() => mockApiService.getAllUsers());
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    const refreshUsers = () => {
        setAllUsers(mockApiService.getAllUsers());
    };

    const handleOpenModal = (user: User | null = null) => {
        setEditingUser(user);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingUser(null);
    };

    const handleSave = () => {
        refreshUsers();
        handleCloseModal();
    };

    const handleDelete = (userId: string) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
            mockApiService.deleteUser(userId);
            refreshUsers();
        }
    };
    
    const filteredUsers = useMemo(() => {
        return allUsers
            .filter(user => {
                if (roleFilter !== 'all' && user.role !== roleFilter) {
                    return false;
                }
                if (searchTerm && !user.name.toLowerCase().includes(searchTerm.toLowerCase())) {
                    return false;
                }
                return true;
            });
    }, [allUsers, searchTerm, roleFilter]);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-brand-text">Gestión de Usuarios</h1>
            
            <Card>
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                    <input
                        type="text"
                        placeholder="Buscar por nombre..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-grow border-gray-300 rounded-md shadow-sm p-2"
                    />
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value as UserRole | 'all')}
                        className="border-gray-300 rounded-md shadow-sm p-2"
                    >
                        <option value="all">Todos los roles</option>
                        <option value={UserRole.STUDENT}>Alumnos</option>
                        <option value={UserRole.PRECEPTOR}>Preceptores</option>
                        <option value={UserRole.ADMIN}>Admins</option>
                    </select>
                     <Button onClick={() => handleOpenModal()} className="flex items-center justify-center gap-2">
                        <Icon name="plus" className="w-5 h-5"/>
                        Crear Usuario
                    </Button>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                                <th scope="col" className="relative px-6 py-3">
                                    <span className="sr-only">Acciones</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredUsers.map((user) => (
                                <tr key={user.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500">{user.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {getRoleBadge(user.role)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex justify-end items-center gap-4">
                                            <button onClick={() => handleOpenModal(user)} className="text-brand-primary hover:text-brand-accent"><Icon name="edit" className="w-5 h-5" /></button>
                                            <button onClick={() => handleDelete(user.id)} className="text-red-600 hover:text-red-800"><Icon name="delete" className="w-5 h-5" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                 {filteredUsers.length === 0 && (
                    <p className="text-center text-gray-500 py-8">No se encontraron usuarios con los filtros aplicados.</p>
                )}
            </Card>

            {isModalOpen && <UserFormModal user={editingUser} onClose={handleCloseModal} onSave={handleSave} />}
        </div>
    );
};

export default UserManagementScreen;