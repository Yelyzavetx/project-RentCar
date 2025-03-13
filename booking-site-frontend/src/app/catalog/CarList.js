"use client";

import React from 'react';
import CarCard from './CarCard';

/**
 * Компонент списка автомобилей
 * @param {Object} props - Свойства компонента
 * @param {Array} props.cars - Массив автомобилей
 * @param {function} [props.onBookClick] - Функция для обработки клика по кнопке бронирования
 * @param {boolean} [props.loading=false] - Флаг загрузки данных
 */
const CarList = ({ cars, onBookClick, loading = false }) => {
    if (loading) {
        return (
            <div className="flex justify-center items-center py-10">
                <div className="text-white">Завантаження...</div>
            </div>
        );
    }

    if (!cars || cars.length === 0) {
        return (
            <div className="flex justify-center items-center py-10">
                <div className="text-white">Автомобілі не знайдені</div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {cars.map((car) => (
                <CarCard
                    key={car.id}
                    car={car}
                    onBookClick={() => onBookClick && onBookClick(car)}
                />
            ))}
        </div>
    );
};

export default CarList;