// src/pages/ReviewsPage.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import api from '../services/api';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 2rem;
`;

const ReviewsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const ReviewCard = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1.5rem;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const ReviewAuthor = styled.h3`
  font-size: 1.2rem;
  margin: 0;
`;

const ReviewDate = styled.span`
  color: #777;
  font-size: 0.9rem;
`;

const ReviewRating = styled.div`
  margin-bottom: 1rem;
  color: #f5b400;
  font-size: 1.2rem;
`;

const ReviewContent = styled.p`
  margin-bottom: 0.5rem;
  line-height: 1.5;
`;

const CarInfo = styled.p`
  font-style: italic;
  color: #666;
  margin-top: 1rem;
  font-size: 0.9rem;
`;

const NoReviewsMessage = styled.p`
  text-align: center;
  font-size: 1.1rem;
  color: #666;
  margin: 3rem 0;
`;

const ReviewsPage = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await api.get('/reviews');
                setReviews(response.data || []);
            } catch (err) {
                setError('Помилка при завантаженні відгуків');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, []);

    if (loading) {
        return <Loader text="Завантаження відгуків..." />;
    }

    if (error) {
        return (
            <Container>
                <ErrorMessage message={error} />
            </Container>
        );
    }

    // Використовуємо мокові дані, якщо з API нічого не прийшло
    const displayReviews = reviews.length > 0 ? reviews : [
        {
            id: '1',
            userId: '101',
            userName: 'Іван Петров',
            carModel: 'Toyota Camry',
            rating: 5,
            comment: 'Відмінний сервіс оренди автомобілів! Швидке оформлення, хороші ціни та якісні автомобілі.',
            createdAt: '2023-04-15T12:30:00'
        },
        {
            id: '2',
            userId: '102',
            userName: 'Ганна Сидорова',
            carModel: 'BMW X5',
            rating: 4,
            comment: 'Зручний сервіс все пройшло гладко. Єдине - був невеликий скол на лобовому склі, але це не завадило поїздці.',
            createdAt: '2023-03-22T14:45:00'
        },
        {
            id: '3',
            userId: '103',
            userName: 'Олексій Ніколаєв',
            carModel: 'Mercedes Benz GLC',
            rating: 5,
            comment: 'Рекомендую всім! Орендував автомобіль на тиждень, жодних проблем не виникло. Задоволений якістю обслуговування.',
            createdAt: '2023-04-03T09:15:00'
        }
    ];

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU');
    };

    const renderStars = (rating) => {
        return '★'.repeat(rating) + '☆'.repeat(5 - rating);
    };

    return (
        <Container>
            <Title>Відгуки клієнтів</Title>

            {displayReviews.length > 0 ? (
                <ReviewsGrid>
                    {displayReviews.map(review => (
                        <ReviewCard key={review.id}>
                            <ReviewHeader>
                                <ReviewAuthor>{review.userName}</ReviewAuthor>
                                <ReviewDate>{formatDate(review.createdAt)}</ReviewDate>
                            </ReviewHeader>
                            <ReviewRating>{renderStars(review.rating)}</ReviewRating>
                            <ReviewContent>{review.comment}</ReviewContent>
                            <CarInfo>Автомобіль: {review.carModel}</CarInfo>
                        </ReviewCard>
                    ))}
                </ReviewsGrid>
            ) : (
                <NoReviewsMessage>Вони з'являться тут, коли клієнти залишать їх після оренди автомобілів..</NoReviewsMessage>
            )}
        </Container>
    );
};

export default ReviewsPage;