// src/components/AdminRoute.js
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
    const { isAuthenticated, isAdmin, loading } = useAuth();
    const location = useLocation();

    // Показуємо завантаження, якщо процес авторизації ще не завершено
    if (loading) {
        return <div>Загрузка...</div>;
    }

    // Перенаправляємо на сторінку входу, якщо користувач не автентифікований
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Перенаправляємо на сторінку з помилкою доступу, якщо користувач не адмін
    if (!isAdmin) {
        return <Navigate to="/unauthorized" replace />;
    }

    // Якщо всі перевірки пройдені, показуємо запитувану сторінку
    return children;
};

export default AdminRoute;