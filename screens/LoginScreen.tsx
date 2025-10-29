import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

const LoginScreen: React.FC = () => {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        const { error } = await login(email, password);
        if (error) {
            setError(error.message);
        }
        setLoading(false);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-brand-background p-4">
            <Card className="w-full max-w-sm">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-brand-text">Asistencia Universitaria</h1>
                    <p className="text-gray-500 mt-2">Iniciar sesión en su cuenta</p>
                </div>
                
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                            required
                            autoComplete="email"
                        />
                    </div>
                     <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                            required
                            autoComplete="current-password"
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <Button 
                        type="submit"
                        className="w-full !py-3 !text-lg"
                        disabled={loading}
                    >
                        {loading ? 'Ingresando...' : 'Ingresar'}
                    </Button>
                </form>

                 <div className="mt-8 text-center text-sm text-gray-500">
                    <p>
                        ¿No tienes una cuenta? <a href="#" className="font-medium text-brand-primary hover:underline">Regístrate</a>
                    </p>
                    <p className="mt-2">
                         <a href="#" className="font-medium text-brand-primary hover:underline">¿Olvidaste tu contraseña?</a>
                    </p>
                </div>
            </Card>
        </div>
    );
};

export default LoginScreen;
