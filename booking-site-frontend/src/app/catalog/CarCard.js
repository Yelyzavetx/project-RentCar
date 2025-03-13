"use client";

import React from 'react';
import Card from '@/components/UI/Card';
import Button from '@/components/UI/Button';
import { useRouter } from 'next/navigation';

/**
 * Компонент карточки автомобиля
 * @param {Object} props - Свойства компонента
 * @param {Object} props.car - Информация об автомобиле
 * @param {function} [props.onBookClick] - Функция для обработки клика по кнопке бронирования
 */
const CarCard = ({ car, onBookClick }) => {
    const router = useRouter();

    const handleBookClick = () => {
        if (onBookClick) {
            onBookClick(car);
        } else {
            router.push('/catalog/${car.id}/booking');
        }
    };

    // Обрабатываем кейс, если изображение отсутствует
    const imageUrl = car.imageUrl || '/images/car-placeholder.png';

    return (
        <Card variant="car" className="flex flex-col h-full">
            {/* Изображение автомобиля */}
            <div className="car-image">
                <img
                    src={imageUrl}
                    alt={car.title}
                    className="w-full h-auto object-contain"
                />
            </div>

            {/* Информация об автомобиле */}
            <div className="mt-2">
                <h3 className="font-semibold">{car.title}</h3>
                <p className="text-sm">{car.price} грн/доба</p>

                {/* Дополнительная информация */}
                <div className="mt-2 text-sm truncate">
                    <p>Більше...</p>
                </div>
            </div>

            {/* Кнопка бронирования */}
            <div className="mt-auto pt-4">
                <Button
                    onClick={handleBookClick}
                    fullWidth
                >
                    Забронити
                </Button>
            </div>
        </Card>
    );
};

export default CarCard;