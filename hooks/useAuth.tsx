
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { User, Student, Preceptor } from '../types';
import { mockApiService } from '../services/mockData';

interface AuthContextType {
    user: User | Student | Preceptor | null;
    login: (email: string) => boolean;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | Student | Preceptor | null>(null);

    const login = (email: string) => {
        const foundUser = mockApiService.login(email);
        if (foundUser) {
            setUser(foundUser);
            return true;
        }
        return false;
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
    }
    return context;
};