"use client";

import React from 'react';
import Card from '@/components/UI/Card';
import Button from '@/components/UI/Button';

/**
 * Компонент истории бронирований пользователя
 * @param {Object} props - Свойства компонента
 * @param {Array} props.bookings - Массив бронирований
 * @param {function} props.onCancelBooking - Функция отмены бронирования
 * @param {function} props.onReviewClick - Функция для оставления отзыва
 * @param {boolean} [props.loading=false] - Флаг загрузки данных
 */
const BookingHistory = ({ bookings, onCancelBooking, onReviewClick, loading = false }) => {
    if (loading) {
        return (
            <div className="text-center py-6 text-white">
                Завантаження історії бронювань...
            </div>
        );
    }

    if (!bookings || bookings.length === 0) {
        return (
            <div className="text-center py-6 text-white">
                У вас ще немає жодного бронювання
            </div>
        );
    }

    // Форматирование даты
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}`;
    };

    // Отображение статуса бронирования
    const getStatusLabel = (status) => {
        const statusMap = {
            PENDING: 'Очікує підтвердження',
            CONFIRMED: 'Підтверджено',
            CANCELLED: 'Скасовано',
            COMPLETED: 'Завершено'
        };
        return statusMap[status] || status;
    };

    return (
        <div className="space-y-4">
            {bookings.map((booking) => (
                <Card key={booking.id} className="p-4">
                    <div className="flex flex-col md:flex-row">
                        {/* Изображение автомобиля */}
                        <div className="w-full md:w-24 md:h-24 bg-gray-700 rounded mb-4 md:mb-0 md:mr-4 flex-shrink-0">
                            {booking.car.imageUrl ? (
                                <img
                                    src={booking.car.imageUrl}
                                    alt={booking.car.title}
                                    className="w-full h-full object-cover rounded"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-10 w-10"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                        />
                                    </svg>
                                </div>
                            )}
                        </div>

                        {/* Информация о бронировании */}
                        <div className="flex-grow">
                            <h3 className="font-semibold mb-2">{booking.car.title}</h3>

                            <div className="grid grid-cols-2 gap-x-4 gap-y-1 mb-4">
                                <div className="text-gray-400">Дати:</div>
                                <div>{formatDate(booking.startDate)} - {formatDate(booking.endDate)}</div>

                                <div className="text-gray-400">Статус:</div>
                                <div>{getStatusLabel(booking.status)}</div>

                                <div className="text-gray-400">Вартість:</div>
                                <div>{booking.totalPrice} грн</div>
                            </div>

                            {/* Кнопки действий */}
                            <div className="flex flex-wrap gap-2 justify-end">
                                {['PENDING', 'CONFIRMED'].includes(booking.status) && (
                                    <Button
                                        onClick={() => onCancelBooking(booking.id)}
                                    >
                                        Скасувати
                                    </Button>
                                )}

                                {booking.status === 'COMPLETED' && (
                                    <Button
                                        onClick={() => onReviewClick(booking)}
                                    >
                                        Залишити відгук
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
};

export default BookingHistory;