// src/pages/HomePage.js - только изменения стилей
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const PageContainer = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
    background-color: #f5f5f5;
    min-height: calc(100vh - 60px);
`;

const HeroSection = styled.section`
    display: flex;
    justify-content: space-between;
    margin-bottom: 2rem;

    @media (max-width: 768px) {
        flex-direction: column;
    }
`;

const LeftSection = styled.div`
    flex: 1;
    padding-right: 2rem;

    @media (max-width: 768px) {
        padding-right: 0;
        margin-bottom: 2rem;
    }
`;

const CompanyName = styled.h1`
    font-size: 3.5rem;
    font-weight: bold;
    margin-bottom: 1rem;
    color: #333;
`;

const CompanyDescription = styled.p`
    font-size: 1.1rem;
    margin-bottom: 1.5rem;
`;

const AdvantagesList = styled.ul`
    list-style-type: none;
    padding: 0;
    margin-bottom: 2rem;
`;

const AdvantageItem = styled.li`
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
    color: #333;

    &:before {
        content: "${props => props.number}. ";
        font-weight: bold;
    }
`;

const ActionSection = styled.div`
    margin-top: 2rem;
`;

const ActionButton = styled(Link)`
    display: inline-block;
    background-color: ${props => props.$primary ? '#4a6bff' : '#333'};
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 4px;
    text-decoration: none;
    font-size: 1rem;
    margin-right: 1rem;

    &:hover {
        background-color: ${props => props.$primary ? '#3451d1' : '#555'};
    }
`;

const WelcomeMessage = styled.div`
    margin-top: 2rem;
    padding: 1.5rem;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ProfileButton = styled(Link)`
    display: inline-block;
    background-color: #4a6bff;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 4px;
    text-decoration: none;
    font-size: 1rem;
    margin-top: 1rem;

    &:hover {
        background-color: #3451d1;
    }
`;

const ReviewsSection = styled.section`
    padding: 2rem 0;
    border-top: 1px solid #ddd;
`;

const SectionTitle = styled.h2`
    font-size: 2rem;
    margin-bottom: 1.5rem;
    color: #333;
`;

const ReviewCard = styled.div`
    background-color: white;
    border-radius: 8px;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const UserAvatar = styled.div`
    width: 60px;
    height: 60px;
    background-image: url('/user.png'); // путь из public
    background-size: cover;
    background-position: center;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 1rem;
    font-size: 1.5rem;
`;


const ReviewContent = styled.div`
    flex: 1;
`;

const ReviewText = styled.div`
    background-color: #f9f9f9;
    padding: 1rem;
    border-radius: 8px;
    position: relative;
    margin-bottom: 0.5rem;
    color: #333;
`;

const ReviewAuthor = styled.p`
    text-align: right;
    font-style: italic;
    color: #666;
`;

const Rating = styled.span`
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    color: #f1c40f;
`;

const ShowMoreButton = styled.button`
    background-color: #4a6bff;
    color: white;
    border: none;
    padding: 0.5rem 2rem;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
    display: block;
    margin: 1rem auto;

    &:hover {
        background-color: #3451d1;
    }
`;

const ContactsSection = styled.section`
    background-color: #333;
    color: white;
    padding: 2rem 0;
`;

const ContactsContent = styled.div`
    display: flex;
    justify-content: space-between;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;

    @media (max-width: 768px) {
        flex-direction: column;
    }
`;

const ContactsTitle = styled.h2`
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: white;
`;

const ContactInfo = styled.div`
    text-align: right;

    @media (max-width: 768px) {
        text-align: left;
        margin-top: 1rem;
    }
`;

const ContactItem = styled.p`
    margin-bottom: 0.5rem;
    font-size: 1rem;
`;



const HomePage = () => {
    const [reviews, setReviews] = useState([]);
    const [reviewsLoading, setReviewsLoading] = useState(true);
    const navigate = useNavigate();
    const { user, loading } = useAuth();

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await api.get('/reviews?limit=3');
                setReviews(response.data.data);
            } catch (error) {
                console.error('Error fetching reviews:', error);
            } finally {
                setReviewsLoading(false);
            }
        };
        fetchReviews();
    }, []);

    const handleShowMore = () => {
        navigate('/reviews');
    };

    return (
        <PageContainer>
            <HeroSection>
                <LeftSection>
                    <CompanyName><strong>RentCar</strong></CompanyName>
                    <CompanyDescription style={{ lineHeight: '1.9' }}>
                        — це сучасна онлайн-платформа з оренди автомобілів у місті Київ. Ми надаємо простий та зручний
                        сервіс, що дозволяє обрати авто за комфортом і ціною, забронювати його онлайн і швидко отримати
                        в користування. Наша мета — зробити процес оренди максимально простим, прозорим і доступним для
                        кожного.
                    </CompanyDescription>

                    <div style={{ marginTop: '2rem' }}>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', textAlign: 'left' }}>Наші переваги:</h3>

                        <div style={{ textAlign: 'center' }}>
                            <ul style={{
                                listStyleType: 'disc',
                                display: 'inline-block',
                                textAlign: 'left',
                                lineHeight: '2',
                                paddingLeft: '1.5rem',
                                margin: 0
                            }}>
                                <li><strong>Швидкість</strong> — бронювання авто в декілька кліків.</li>
                                <li><strong>Прозорість</strong> — чесні умови, чіткі тарифи та історія бронювань.</li>
                                <li><strong>Гнучкість</strong> — великий вибір авто різних класів з наявністю страхування.</li>
                                <li><strong>Безпека</strong> — захист персональних даних і страхування кожного авто.</li>
                                <li><strong>Контроль</strong> — особистий кабінет для керування бронюваннями та перегляду історії замовлень.</li>
                                <li><strong>Надійність</strong> — перевірені авто та реальні відгуки клієнтів.</li>
                            </ul>
                        </div>
                    </div>




                    {!loading && (
                        <>
                            {user ? (
                                <WelcomeMessage>
                                    <h3>Ласкаво просимо, {user.name}!</h3>
                                    <p>Дякуємо вам за використання нашого сервісу.</p>
                                    <ProfileButton to="/profile">Особистий кабінет</ProfileButton>
                                </WelcomeMessage>
                            ) : (
                                <ActionSection>
                                    <ActionButton to="/register" $primary>Зареєструватися</ActionButton>
                                    <ActionButton to="/login">Увійти</ActionButton>
                                </ActionSection>
                            )}
                        </>
                    )}
                </LeftSection>
            </HeroSection>

            <ReviewsSection>
                <SectionTitle>Відгуки</SectionTitle>

                {reviewsLoading ? (
                    <p>Завантаження відгуків...</p>
                ) : reviews.length > 0 ? (
                    <>
                        {reviews.map(review => (
                            <ReviewCard key={review.id}>
                                <UserAvatar></UserAvatar>
                                <ReviewContent>
                                    <ReviewText>
                                        "{review.comment}"
                                        <Rating>⭐️{review.rating}</Rating>
                                    </ReviewText>
                                    <ReviewAuthor>
                                        {review.user?.name || 'Користувач'},
                                        {review.catalogItem?.title || 'Невідомий автомобіль'}
                                    </ReviewAuthor>
                                </ReviewContent>
                            </ReviewCard>
                        ))}

                        <ShowMoreButton onClick={handleShowMore}>
                            Показати більше
                        </ShowMoreButton>
                    </>
                ) : (
                    <p>Ще немає відгуків.</p>
                )}
            </ReviewsSection>

            <ContactsSection>
                <ContactsContent>
                    <ContactsTitle>Контакти</ContactsTitle>
                    <ContactInfo>
                        <ContactItem>+380123456789</ContactItem>
                        <ContactItem>Rent.car@gmail.com</ContactItem>
                        <ContactItem>м. Київ, вул. Воскресенська 12а</ContactItem>
                    </ContactInfo>
                </ContactsContent>
            </ContactsSection>
        </PageContainer>
    );
};

export default HomePage;