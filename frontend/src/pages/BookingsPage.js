// src/pages/BookingsPage.js
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Loader from '../components/Loader';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
`;

const BookingCard = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const BookingInfo = styled.div`
  margin-bottom: 1rem;
`;

const InfoItem = styled.div`
  margin-bottom: 0.5rem;
`;

const Label = styled.span`
  font-weight: bold;
  margin-right: 0.5rem;
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
  color: white;
  background-color: ${props => {
    switch (props.status) {
        case 'Подтверждено': return '#388e3c';
        case 'Ожидает подтверждения': return '#f57c00';
        case 'Отменено': return '#d32f2f';
        default: return '#757575';
    }
}};
`;

const BookingsPage = () => {
    const { user, loading } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [pageLoading, setPageLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBookings = async () => {
            if (user) {
                try {
                    const response = await api.get('/bookings');
                    setBookings(response.data || []);
                } catch (err) {
                    setError('Помилка при завантаженні бронювань');
                    console.error(err);
                } finally {
                    setPageLoading(false);
                }
            } else {
                setPageLoading(false);
            }
        };

        if (!loading) {
            fetchBookings();
        }
    }, [user, loading]);

    // Якщо користувач не авторизований, перенаправляємо на сторінку входу
    if (!loading && !user) {
        return <Navigate to="/login" />;
    }

    if (loading || pageLoading) {
        return <Loader text="Завантаження бронювань..." />;
    }

    if (error) {
        return (
            <Container>
                <p>Ошибка: {error}</p>
            </Container>
        );
    }

    // Використовуємо мокові дані, якщо з API нічого не прийшло
    const displayBookings = bookings.length > 0 ? bookings : [
        { id: '1', carTitle: 'Тестовий автомобіль 1', startDate: '2023-05-15', endDate: '2023-05-18', status: 'Підтверждено' },
        { id: '2', carTitle: 'Тестовий автомобіль 2', startDate: '2023-06-10', endDate: '2023-06-12', status: 'Очікує підтвердження' }
    ];

    return (
        <Container>
            <Title>Мої бронювання</Title>

            {displayBookings.length > 0 ? (
                displayBookings.map((booking) => (
                    <BookingCard key={booking.id}>
                        <BookingInfo>
                            <InfoItem>
                                <Label>Автомобіль:</Label>
                                {booking.carTitle}
                            </InfoItem>
                            <InfoItem>
                                <Label>Період:</Label>
                                {`${booking.startDate} - ${booking.endDate}`}
                            </InfoItem>
                            <InfoItem>
                                <Label>Статус:</Label>
                                <StatusBadge status={booking.status}>{booking.status}</StatusBadge>
                            </InfoItem>
                        </BookingInfo>
                    </BookingCard>
                ))
            ) : (
                <p>У вас поки що немає бронювань</p>
            )}
        </Container>
    );
};

export default BookingsPage;