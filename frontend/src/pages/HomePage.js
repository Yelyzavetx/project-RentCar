// src/pages/HomePage.js - только изменения стилей
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';

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
    color: #666;
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
    background-color: #f8c0e0;
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
    const { user } = useAuth(); // Получаем информацию о текущем пользователе

    useEffect(() => {
        // Загрузка відгук з API
        // Заглушка - використовуємо моковые данные
        const mockReviews = [
            { id: 1, userName: 'Марина Іваненко', car: 'Nissan Juke', text: 'Дуже гарна компанія!', rating: 5 },
            { id: 2, userName: 'Петро Марченко', car: 'Ford Kuga', text: 'Дуже гарна компанія!', rating: 5 },
            { id: 3, userName: 'Сергій Іванюк', car: 'Mercedes Gla', text: 'Дуже гарна компанія!', rating: 5 }
        ];

        setReviews(mockReviews);
        setReviewsLoading(false);
    }, []);

    const handleShowMore = () => {
        navigate('/reviews');
    };

    return (
        <PageContainer>
            <HeroSection>
                <LeftSection>
                    <CompanyName>RentCar</CompanyName>
                    <CompanyDescription>Короткий опис компанії...</CompanyDescription>
                    <div>
                        <h3>Переваги компанії:</h3>
                        <AdvantagesList>
                            <AdvantageItem number="1">перевага1</AdvantageItem>
                            <AdvantageItem number="2">перевага2</AdvantageItem>
                            <AdvantageItem number="3">перевага3</AdvantageItem>
                        </AdvantagesList>
                    </div>

                    {/* Показываем разное содержимое в зависимости от авторизации */}
                    {user ? (
                        <WelcomeMessage>
                            <h3>Ласкаво просимо, {user.firstName || user.name}!</h3>
                            <p>Дякуємо вам за використання нашого сервісу.</p>
                            <ProfileButton to="/profile">Особистий кабінет</ProfileButton>
                        </WelcomeMessage>
                    ) : (
                        <ActionSection>
                            <ActionButton to="/register" $primary>Зареєструватися</ActionButton>
                            <ActionButton to="/login">Увійти</ActionButton>
                        </ActionSection>
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
                                <UserAvatar>👤</UserAvatar>
                                <ReviewContent>
                                    <ReviewText>
                                        "{review.text}"
                                        <Rating>⭐{review.rating}</Rating>
                                    </ReviewText>
                                    <ReviewAuthor>{review.userName}, {review.car}</ReviewAuthor>
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