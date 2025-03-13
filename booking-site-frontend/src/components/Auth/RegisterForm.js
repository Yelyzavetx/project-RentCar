"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/UI/Button';

/**
 * Компонент формы регистрации
 */
const RegisterForm = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        passwordConfirm: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Проверка совпадения паролей
        if (formData.password !== formData.passwordConfirm) {
            setError('Паролі не співпадають');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // В реальном приложении здесь будет запрос к API
            // Для примера просто имитируем успешную регистрацию
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Имитация сохранения токена
            localStorage.setItem('token', 'example-token');

            // Перенаправление на профиль
            router.push('/profile');
        } catch (err) {
            setError('Помилка реєстрації. Спробуйте ще раз.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">Реєстрація</h2>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Имя */}
                <div>
                    <label className="block mb-1 font-medium text-white">Ім`я</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="form-input"
                        required
                    />
                </div>

                {/* Email */}
                <div>
                    <label className="block mb-1 font-medium text-white">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="form-input"
                        required
                    />
                </div>

                {/* Пароль */}
                <div>
                    <label className="block mb-1 font-medium text-white">Пароль</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="form-input"
                        required
                        minLength={6}
                    />
                </div>

                {/* Подтверждение пароля */}
                <div>
                    <label className="block mb-1 font-medium text-white">Підтвердження пароля</label>
                    <input
                        type="password"
                        name="passwordConfirm"
                        value={formData.passwordConfirm}
                        onChange={handleChange}
                        className="form-input"
                        required
                    />
                </div>

                {/* Кнопка отправки */}
                <Button
                    type="submit"
                    fullWidth
                    disabled={loading}
                >
                    {loading ? 'Завантаження...' : 'Зареєструватися'}
                </Button>

                {/* Ссылка на вход */}
                <div className="text-center mt-4">
                    <p className="text-white">
                        Вже є обліковий запис?{' '}
                        <Link href="/auth/login" className="text-primary hover:underline">
                            Увійти
                        </Link>
                    </p>
                </div>
            </form>
        </div>
    );
};

export default RegisterForm;