import React, { useState, useEffect } from 'react';
import * as api from '../../services/api';
import { Note } from '../../types';
import Card from '../common/Card';
import { useAuth } from '../../hooks/useAuth';
import Button from '../common/Button';
import Icon from '../common/Icon';

const PersonalTasksCard: React.FC = () => {
    const { user } = useAuth();
    const [tasks, setTasks] = useState<Note[]>([]);
    const [isAdding, setIsAdding] = useState(false);
    const [newTask, setNewTask] = useState({ text: '', date: new Date().toISOString().split('T')[0] });
    const [editingTask, setEditingTask] = useState<Note | null>(null);
    const [loading, setLoading] = useState(false);

    const loadTasks = async () => {
        if (user) {
            setLoading(true);
            try {
                const data = await api.getNotes(user.id);
                setTasks(data);
            } catch(error) {
                console.error("Failed to load tasks", error);
            } finally {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        loadTasks();
    }, [user]);

    const handleAddTask = async () => {
        if (newTask.text.trim() && newTask.date && user) {
            await api.addNote(user.id, newTask.text.trim(), newTask.date);
            setNewTask({ text: '', date: new Date().toISOString().split('T')[0] });
            setIsAdding(false);
            loadTasks();
        }
    };

    const handleUpdateTask = async () => {
        if (editingTask && editingTask.text.trim() && editingTask.date) {
            await api.updateNote(editingTask.id, editingTask.text.trim(), editingTask.date);
            setEditingTask(null);
            loadTasks();
        }
    };

    const handleDeleteTask = async (taskId: string) => {
        if (window.confirm('¿Seguro que quieres eliminar esta tarea?')) {
            await api.deleteNote(taskId);
            loadTasks();
        }
    };

    return (
        <Card>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-brand-text">Mis Tareas</h2>
                {!isAdding && <Button variant="secondary" className="!py-1 !px-2" onClick={() => setIsAdding(true)}><Icon name="plus" className="w-5 h-5"/></Button>}
            </div>

            {isAdding && (
                <div className="p-3 bg-gray-50 rounded-lg mb-4 space-y-2">
                     <textarea
                        value={newTask.text}
                        onChange={(e) => setNewTask({...newTask, text: e.target.value})}
                        placeholder="Añadir una nueva tarea..."
                        className="w-full border-gray-300 rounded-md shadow-sm p-2 text-sm"
                        rows={2}
                        autoFocus
                    />
                    <div className="flex gap-2 justify-end items-center">
                        <input
                            type="date"
                            value={newTask.date}
                            onChange={(e) => setNewTask({...newTask, date: e.target.value})}
                            className="border-gray-300 rounded-md shadow-sm p-1 text-sm"
                        />
                        <Button variant="secondary" className="!py-1 !px-2" onClick={() => setIsAdding(false)}>Cancelar</Button>
                        <Button className="!py-1 !px-2" onClick={handleAddTask}>Añadir</Button>
                    </div>
                </div>
            )}
            
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {loading && <p>Cargando tareas...</p>}
                {!loading && tasks.length > 0 ? tasks.map(task => (
                    <div key={task.id} className="p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
                        <div className="flex justify-between items-start">
                             <p className="text-gray-800 whitespace-pre-wrap text-sm">{task.text}</p>
                             <span className="text-xs font-semibold text-yellow-800 bg-yellow-200 px-2 py-1 rounded-full whitespace-nowrap ml-2">{new Date(task.date + 'T00:00:00').toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}</span>
                        </div>
                        <div className="flex justify-end items-center mt-2">
                            <div className="flex gap-2">
                                <button onClick={() => setEditingTask(task)} className="text-gray-500 hover:text-brand-primary"><Icon name="edit" className="w-4 h-4" /></button>
                                <button onClick={() => handleDeleteTask(task.id)} className="text-gray-500 hover:text-red-600"><Icon name="delete" className="w-4 h-4" /></button>
                            </div>
                        </div>
                    </div>
                )) : (
                     !loading && <p className="text-gray-500 text-center py-4">No tienes tareas personales.</p>
                )}
            </div>

            {editingTask && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={() => setEditingTask(null)}>
                    <Card className="w-11/12 max-w-lg" onClick={e => e.stopPropagation()}>
                        <h3 className="text-xl font-bold mb-4">Editar Tarea</h3>
                        <div className="space-y-4">
                            <textarea
                                value={editingTask.text}
                                onChange={(e) => setEditingTask({ ...editingTask, text: e.target.value })}
                                className="w-full border-gray-300 rounded-md shadow-sm p-2"
                                rows={4}
                            />
                             <input
                                type="date"
                                value={editingTask.date}
                                onChange={(e) => setEditingTask({ ...editingTask, date: e.target.value })}
                                className="w-full border-gray-300 rounded-md shadow-sm p-2"
                            />
                        </div>
                        <div className="flex justify-end gap-2 mt-4">
                            <Button variant="secondary" onClick={() => setEditingTask(null)}>Cancelar</Button>
                            <Button onClick={handleUpdateTask}>Guardar</Button>
                        </div>
                    </Card>
                </div>
            )}
        </Card>
    );
};

export default PersonalTasksCard;
