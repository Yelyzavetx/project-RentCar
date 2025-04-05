import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import Loader from '../components/Loader';

const Container = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
`;

const CarDetails = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
    }
`;

const ImageContainer = styled.div`
    background-color: #f0f0f0;
    height: 300px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const InfoContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

const Title = styled.h1`
    font-size: 2rem;
    margin-bottom: 1rem;
`;

const Price = styled.p`
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 1rem;
`;

const Description = styled.p`
    margin-bottom: 1.5rem;
    line-height: 1.5;
`;

const BookingForm = styled.div`
    margin-top: 2rem;
    padding: 1.5rem;
    border: 1px solid #ddd;
    border-radius: 8px;
`;

const BookButton = styled.button`
    background-color: #4a6bff;
    color: white;
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    margin-top: 1rem;

    &:hover {
        background-color: #3451d1;
    }
`;

const CarDetailPage = () => {
    const { id } = useParams();
    const [car, setCar] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // У реальному додатку тут буде запит до API
        // для отримання даних про автомобіль з id

        // Імітація завантаження даних
        setTimeout(() => {
            setCar({
                id,
                title: 'Тестовий автомобіль',
                price: 1500,
                description: 'Детальний опис автомобіля. Тут може бути інформація про характеристики, особливості та переваги даної моделі.'
            });
            setLoading(false);
        }, 500);
    }, [id]);

    if (loading) {
        return <Loader text="Завантаження даних автомобіля..." />;
    }

    return (
        <Container>
            <CarDetails>
                <ImageContainer>
                    <span>Фото автомобіля</span>
                </ImageContainer>

                <InfoContainer>
                    <Title>{car.title}</Title>
                    <Price>{car.price} грн/доба</Price>
                    <Description>{car.description}</Description>

                    <BookingForm>
                        <h2>Форма бронювання</h2>
                        <p>Тут буде форма для вибору дат оренди</p>
                        <BookButton>Забронювати</BookButton>
                    </BookingForm>
                </InfoContainer>
            </CarDetails>
        </Container>
    );
};

export default CarDetailPage;