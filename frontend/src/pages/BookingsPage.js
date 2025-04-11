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
                    // Используем data.data, так как API возвращает { status, data }
                    setBookings(response.data.data || []);
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
                <p>Помилка: {error}</p>
            </Container>
        );
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('uk-UA');
    };

    return (
        <Container>
            <Title>Мої бронювання</Title>

            {bookings.length > 0 ? (
                bookings.map((booking) => (
                    <BookingCard key={booking.id}>
                        <BookingInfo>
                            <InfoItem>
                                <Label>Автомобіль:</Label>
                                {booking.catalogItem?.title || "Невідомий автомобіль"}
                            </InfoItem>
                            <InfoItem>
                                <Label>Період:</Label>
                                {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                            </InfoItem>
                            <InfoItem>
                                <Label>Сума:</Label>
                                {booking.totalPrice} грн
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