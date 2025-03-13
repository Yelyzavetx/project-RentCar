"use client";

import React from 'react';
import Card from '@/components/UI/Card';

/**
 * Компонент информации о пользователе
 * @param {Object} props - Свойства компонента
 * @param {Object} props.user - Информация о пользователе
 */
const UserInfo = ({ user }) => {
    if (!user) {
        return (
            <Card className="p-6">
                <div className="text-center">Інформація про користувача недоступна</div>
            </Card>
        );
    }

    return (
        <Card className="p-6 flex">
            {/* Аватар пользователя */}
            <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center mr-6 flex-shrink-0">
                <svg
                    className="w-14 h-14 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                </svg>
            </div>

            {/* Информация о пользователе */}
            <div className="flex-grow">
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    <div className="font-medium">Ім`я:</div>
                    <div>{user.name}</div>

                    <div className="font-medium">Прізвище:</div>
                    <div>{user.lastName || 'Не вказано'}</div>

                    <div className="font-medium">По-батькові:</div>
                    <div>{user.middleName || 'Не вказано'}</div>

                    <div className="font-medium">Номер телефону:</div>
                    <div>{user.phone || 'Не вказано'}</div>

                    <div className="font-medium">Email:</div>
                    <div>{user.email}</div>
                </div>
            </div>
        </Card>
    );
};

export default UserInfo;