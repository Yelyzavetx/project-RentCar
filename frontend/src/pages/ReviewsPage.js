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

const ConfirmButton = styled.button`
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

const ReviewsPage = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await api.get('/reviews');
                setReviews(response.data.data);
            } catch (err) {
                setError('Помилка при завантаженні відгуків');
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('uk-UA');
    };

    const renderStars = (rating) => {
        return '★'.repeat(rating) + '☆'.repeat(5 - rating);
    };

    if (loading) return <Loader text="Завантаження відгуків..." />;
    if (error) return <ErrorMessage message={error} />;

    return (
        <Container>
            <Title>Відгуки клієнтів</Title>

            {reviews.length > 0 ? (
                <ReviewsGrid>
                    {reviews.map(review => (
                        <ReviewCard key={review.id}>
                            <ReviewHeader>
                                <ReviewAuthor>{review.user?.name || 'Користувач'}</ReviewAuthor>
                                <ReviewDate>{formatDate(review.createdAt)}</ReviewDate>
                            </ReviewHeader>
                            <ReviewRating>{renderStars(review.rating)}</ReviewRating>
                            <ReviewContent>{review.comment}</ReviewContent>
                            <CarInfo>
                                Автомобіль: {review.catalogItem?.title || "Невідомий автомобіль"}
                            </CarInfo>
                        </ReviewCard>
                    ))}
                </ReviewsGrid>
            ) : (
                <NoReviewsMessage>
                    Вони з'являться тут, коли клієнти залишать їх після оренди автомобілів..
                </NoReviewsMessage>
            )}
        </Container>
    );
};

export default ReviewsPage;