"use client";

import React, { useState, useEffect } from 'react';
import CarList from '@/components/Catalog/CarList';
import Button from '@/components/UI/Button';

export default function CatalogPage() {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('all');

    useEffect(() => {
        // Здесь в реальном приложении будет запрос к API
        // Для примера используем моковые данные
        const mockCars = [
            {
                id: '1',
                title: 'Марка, модель',
                price: 1300,
                imageUrl: '',
                category: 'economy'
            },
            {
                id: '2',
                title: 'Марка, модель',
                price: 1500,
                imageUrl: '',
                category: 'comfort'
            },
            {
                id: '3',
                title: 'Марка, модель',
                price: 2000,
                imageUrl: '',
                category: 'business'
            },
            {
                id: '4',
                title: 'Марка, модель',
                price: 3000,
                imageUrl: '',
                category: 'elite'
            }
        ];

        setTimeout(() => {
            setCars(mockCars);
            setLoading(false);
        }, 500);
    }, []);

    const filteredCars = selectedCategory === 'all'
        ? cars
        : cars.filter(car => car.category === selectedCategory);

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Каталог автомобілів</h1>

            {/* Фильтр категорий */}
            <div className="category-menu mb-6">
                <button
                    className={`category-item ${selectedCategory === 'all' ? 'bg-primary' : ''}`}
                    onClick={() => handleCategoryChange('all')}
                >
                    Усі
                </button>
                <button
                    className={`category-item ${selectedCategory === 'economy' ? 'bg-primary' : ''}`}
                    onClick={() => handleCategoryChange('economy')}
                >
                    Економ
                </button>
                <button
                    className={`category-item ${selectedCategory === 'comfort' ? 'bg-primary' : ''}`}
                    onClick={() => handleCategoryChange('comfort')}
                >
                    Комфорт
                </button>
                <button
                    className={`category-item ${selectedCategory === 'business' ? 'bg-primary' : ''}`}
                    onClick={() => handleCategoryChange('business')}
                >
                    Бізнес
                </button>
                <button
                    className={`category-item ${selectedCategory === 'elite' ? 'bg-primary' : ''}`}
                    onClick={() => handleCategoryChange('elite')}
                >
                    Еліт
                </button>
            </div>

            {/* Список автомобилей */}
            <CarList
                cars={filteredCars}
                loading={loading}
                onBookClick={(car) => {
                    alert(`Бронирование автомобиля ${car.title}`);
                    // Здесь будет открытие модального окна с формой бронирования
                }}
            />
        </div>
    );
}