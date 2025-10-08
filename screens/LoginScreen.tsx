
import React from 'react';
import { useAuth } from '../hooks/useAuth';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { students, preceptors, admins } from '../services/mockData';

const LoginScreen: React.FC = () => {
    const { login } = useAuth();

    const handleLogin = (email: string) => {
        login(email);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-brand-background p-4">
            <Card className="w-full max-w-sm">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-brand-text">Prototipo Asistencia</h1>
                    <p className="text-gray-500 mt-2">Seleccione un rol para ingresar</p>
                </div>
                
                <div className="space-y-4">
                    <Button 
                        onClick={() => handleLogin(students[0].email)} 
                        className="w-full !py-4 !text-lg"
                        aria-label={`Ingresar como ${students[0].name}`}
                    >
                        Prototipo Alumno
                    </Button>
                    <Button 
                        onClick={() => handleLogin(preceptors[0].email)} 
                        variant="secondary" 
                        className="w-full !py-4 !text-lg"
                        aria-label={`Ingresar como ${preceptors[0].name}`}
                    >
                        Prototipo Preceptor
                    </Button>
                    <Button 
                        onClick={() => handleLogin(admins[0].email)} 
                        variant="danger" 
                        className="w-full !py-4 !text-lg"
                        aria-label={`Ingresar como ${admins[0].name}`}
                    >
                        Prototipo Administrador
                    </Button>
                </div>

                <div className="mt-8 text-center text-sm text-gray-500">
                    <p>Esta es una versión de demostración. Haga clic en un rol para acceder a una cuenta de prueba.</p>
                </div>
            </Card>
        </div>
    );
};

export default LoginScreen;