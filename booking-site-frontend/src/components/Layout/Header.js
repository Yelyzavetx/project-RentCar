"use client";

import React from 'react';
import Link from 'next/link';

/**
 * Компонент шапки сайта
 */
const Header = () => {
    return (
        <header className="bg-gray-900 text-white py-3">
            <div className="container mx-auto px-4 flex justify-between items-center">
                <div className="flex items-center space-x-4">
                    {/* Логотип */}
                    <Link href="/" className="text-white font-bold">
                        Logo
                    </Link>

                    {/* Навигация */}
                    <nav className="hidden sm:block">
                        <Link
                            href="/catalog"
                            className="text-white hover:text-primary-light ml-4"
                        >
                            Каталог
                        </Link>
                    </nav>
                </div>

                {/* Правая часть шапки */}
                <div className="flex items-center">
                    {/* Иконка пользователя */}
                    <Link href="/profile" className="text-white ml-4">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                        </svg>
                    </Link>

                    {/* Поиск */}
                    <button className="text-white ml-4">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;