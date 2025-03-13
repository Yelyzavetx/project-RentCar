"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/UI/Button';

/**
 * Компонент формы входа
 */
const LoginForm = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
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
        setLoading(true);
        setError('');

        try {
            // В реальном приложении здесь будет запрос к API
            // Для примера просто имитируем успешный вход
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Имитация сохранения токена
            localStorage.setItem('token', 'example-token');

            // Перенаправление на профиль
            router.push('/profile');
        } catch (err) {
            setError('Помилка входу. Перевірте email та пароль.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">Вхід</h2>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
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
                    />
                </div>

                {/* Кнопка отправки */}
                <Button
                    type="submit"
                    fullWidth
                    disabled={loading}
                >
                    {loading ? 'Завантаження...' : 'Увійти'}
                </Button>

                {/* Ссылка на регистрацию */}
                <div className="text-center mt-4">
                    <p className="text-white">
                        Немає облікового запису?{' '}
                        <Link href="/auth/register" className="text-primary hover:underline">
                            Зареєструватися
                        </Link>
                    </p>
                </div>
            </form>
        </div>
    );
};

export default LoginForm;