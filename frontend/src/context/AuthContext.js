// src/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const initAuth = async () => {
            setLoading(true); // Ensure loading is true when checking auth
            try {
                if (authService.setupAuth()) {
                    const userData = await authService.getCurrentUser();
                    setUser(userData);
                    setIsAdmin(userData && userData.role === 'ADMIN');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                authService.logout();
                setUser(null);
                setIsAdmin(false);
            } finally {
                setLoading(false);
            }
        };

        initAuth();
    }, []);

    const login = async (credentials) => {
        try {
            const data = await authService.login(credentials);
            const userData = data.user || data;
            setUser(userData);
            // Встановлюємо статус адміну після успішного входу
            setIsAdmin(userData && userData.role === 'ADMIN');
            return data;
        } catch (error) {
            throw error;
        }
    };

    const register = async (userData) => {
        try {
            console.log('Sending registration data:', userData); // Для відкладки
            const data = await authService.register(userData);
            return data;
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
        setIsAdmin(false); // Скидаємо статус адміну під час виходу
    };

    //Перевірка, чи автентифікований користувач
    const isAuthenticated = !!user;

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            login,
            register,
            logout,
            isAuthenticated,
            isAdmin
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);