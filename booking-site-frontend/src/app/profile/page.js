"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import UserInfo from '@/components/Profile/UserInfo';
import BookingHistory from '@/components/Profile/BookingHistory';
import Button from '@/components/UI/Button';

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('bookings');

    useEffect(() => {
        // Проверка аутентификации
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/auth/login');
            return;
        }

        // Имитация загрузки данных пользователя
        const fetchUserData = async () => {
            try {
                // В реальном приложении здесь будет запрос к API
                await new Promise(resolve => setTimeout(resolve, 500));

                // Моковые данные пользователя
                setUser({
                    name: 'Вася',
                    lastName: 'Пупкин',
                    middleName: 'Иванович',
                    phone: '+380506667783',
                    email: 'vasya.pupkin@gmail.com'
                });

                // Моковые данные бронирований
                setBookings([
                    {
                        id: '1',
                        startDate: '2023-06-10',
                        endDate: '2023-06-15',
                        status: 'COMPLETED',
                        totalPrice: 6500,
                        car: {
                            title: 'Марка, модель',
                            imageUrl: ''
                        }
                    },
                    {
                        id: '2',
                        startDate: '2023-07-20',
                        endDate: '2023-07-25',
                        status: 'CONFIRMED',
                        totalPrice: 7500,
                        car: {
                            title: 'Марка, модель',
                            imageUrl: ''
                        }
                    }
                ]);

                setLoading(false);
            } catch (error) {
                console.error('Error fetching user data:', error);
                setLoading(false);
            }
        };

        fetchUserData();
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        router.push('/');
    };

    const handleCancelBooking = (bookingId) => {
        if (window.confirm('Ви впевнені, що хочете скасувати бронювання?')) {
            // В реальном приложении здесь будет запрос к API
            // Для примера просто обновляем локальное состояние
            setBookings(bookings.map(booking =>
                booking.id === bookingId
                    ? { ...booking, status: 'CANCELLED' }
                    : booking
            ));
        }
    };

    const handleReviewClick = (booking) => {
        alert(`Оставить отзыв для ${booking.car.title}`);
        // В реальном приложении здесь будет открытие модального окна с формой отзыва
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-10">
                <div className="text-white">Завантаження...</div>
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Особистий кабінет</h1>

            {/* Информация о пользователе */}
            <UserInfo user={user} />

            {/* Вкладки */}
            <div className="flex mt-6 mb-4">
                <Button
                    variant={activeTab === 'bookings' ? 'primary' : 'secondary'}
                    onClick={() => setActiveTab('bookings')}
                    className="mr-2"
                >
                    Мої броні
                </Button>
                <Button
                    variant={activeTab === 'history' ? 'primary' : 'secondary'}
                    onClick={() => setActiveTab('history')}
                    className="mr-2"
                >
                    Історія бронювань
                </Button>
                <Button
                    onClick={handleLogout}
                    className="ml-auto"
                >
                    Вийти
                </Button>
            </div>

            {/* История бронирований */}
            {activeTab === 'bookings' && (
                <BookingHistory
                    bookings={bookings.filter(b => ['PENDING', 'CONFIRMED'].includes(b.status))}
                    onCancelBooking={handleCancelBooking}
                    onReviewClick={handleReviewClick}
                />
            )}

            {/* История прошлых бронирований */}
            {activeTab === 'history' && (
                <BookingHistory
                    bookings={bookings.filter(b => ['COMPLETED', 'CANCELLED'].includes(b.status))}
                    onCancelBooking={handleCancelBooking}
                    onReviewClick={handleReviewClick}
                />
            )}
        </div>
    );
}