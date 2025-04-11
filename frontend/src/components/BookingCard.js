import React from 'react';
import styled from 'styled-components';

// Определяем стилизованные компоненты
const Card = styled.div`
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 1.5rem;
    margin-bottom: 1rem;
    background-color: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const BookingInfo = styled.div`
    margin-bottom: 0.5rem;
`;

const Label = styled.span`
    font-weight: bold;
    margin-right: 0.5rem;
`;

const Button = styled.button`
    background-color: #4a6bff;
    color: white;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 1rem;

    &:hover {
        background-color: #3451d1;
    }
`;

// Функция форматирования даты
const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('uk-UA');
};

const BookingCard = ({ booking, onCancel, onReview }) => {
    return (
        <Card>
            <BookingInfo>
                <Label>Автомобіль:</Label>
                {booking.catalogItem?.title || "Невідомий автомобіль"}
            </BookingInfo>
            <BookingInfo>
                <Label>Період:</Label>
                {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
            </BookingInfo>
            <BookingInfo>
                <Label>Сума:</Label>
                {booking.totalPrice} грн
            </BookingInfo>
            <Button onClick={() => onCancel(booking.id)}>Відмінити</Button>
            {booking.hasReview && (
                <BookingInfo>
                    <Label>Відгук:</Label>
                    Залишений
                </BookingInfo>
            )}
            {!booking.hasReview && (
                <Button onClick={() => onReview(booking)}>
                    Залишити відгук
                </Button>
            )}
        </Card>
    );
};

export default BookingCard;