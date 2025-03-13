"use client";

import React from 'react';

/**
 * Компонент подвала сайта
 */
const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white py-6 mt-auto">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between">
                    {/* Контактная информация */}
                    <div className="mb-4 md:mb-0">
                        <h2 className="text-xl font-bold mb-2">Контакти</h2>
                        <div className="text-gray-300">
                            <p>+380123456789</p>
                            <p>Rent.car@gmail.com</p>
                            <p>м. Київ, вул. Воскресенська 12a</p>
                        </div>
                    </div>

                    {/* Социальные сети или другая информация */}
                    <div>
                        <h2 className="text-xl font-bold mb-2">Соціальні мережі</h2>
                        <div className="text-gray-300">
                            <p>Facebook</p>
                            <p>Instagram</p>
                            <p>Telegram</p>
                        </div>
                    </div>
                </div>

                {/* Копирайт */}
                <div className="mt-6 pt-6 border-t border-gray-700 text-gray-400 text-center">
                    <p>&copy; {new Date().getFullYear()} RentCar. Всі права захищені.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;