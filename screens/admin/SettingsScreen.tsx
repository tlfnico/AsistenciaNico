import React from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const SettingsScreen: React.FC = () => {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-brand-text">Configuración</h1>
            <Card>
                <h2 className="text-xl font-bold text-brand-text mb-4">Configuración General</h2>
                <div className="space-y-4">
                     <div>
                        <label htmlFor="institutionName" className="block text-sm font-medium text-gray-700">Nombre de la Institución</label>
                        <input
                            type="text"
                            id="institutionName"
                            defaultValue="Universidad de Ejemplo"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                        />
                    </div>
                     <div>
                        <label htmlFor="logo" className="block text-sm font-medium text-gray-700">Logo de la Institución</label>
                        <input
                            type="file"
                            id="logo"
                            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-brand-primary hover:file:bg-blue-100"
                        />
                    </div>
                </div>
                 <div className="mt-6 flex justify-end">
                    <Button>Guardar Cambios</Button>
                </div>
            </Card>
            <Card>
                 <p className="text-gray-500">Esta sección está en construcción. La funcionalidad de guardar no está implementada.</p>
            </Card>
        </div>
    );
};

export default SettingsScreen;
