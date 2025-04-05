// src/pages/ProfilePage.js
import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import api from '../services/api';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 2rem;
`;

const ProfileCard = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ProfileInfo = styled.div`
  margin-bottom: 0.5rem;
`;

const Label = styled.span`
  font-weight: bold;
  margin-right: 0.5rem;
`;

const BookingCard = styled.div`
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 1rem;
  background-color: white;
`;

const BookingInfo = styled.div`
  margin-bottom: 0.5rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  margin: 2rem 0 1rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
`;

const Button = styled.button`
  background-color: ${props => props.$primary ? '#4a6bff' : '#333'};
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background-color: ${props => props.$primary ? '#3451d1' : '#555'};
  }
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const LogoutButton = styled.button`
  background-color: #d32f2f;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 2rem;
  
  &:hover {
    background-color: #b71c1c;
  }
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: bold;
  color: white;
  background-color: ${props => {
    switch (props.status) {
        case 'CONFIRMED': return '#388e3c';
        case 'PENDING': return '#f57c00';
        case 'CANCELLED': return '#d32f2f';
        case 'COMPLETED': return '#7986cb';
        default: return '#757575';
    }
}};
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 2rem;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

const ModalTitle = styled.h3`
  margin-top: 0;
  margin-bottom: 1.5rem;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: vertical;
  min-height: 100px;
  margin-bottom: 1rem;
`;

const RatingContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

const StarButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: ${props => props.selected ? '#f1c40f' : '#ddd'};
  
  &:hover {
    color: #f1c40f;
  }
`;

const ModalButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
`;

const ProfilePage = () => {
    const { user, loading, logout } = useAuth();
    const [activeBookings, setActiveBookings] = useState([]);
    const [historyBookings, setHistoryBookings] = useState([]);
    const [bookingsLoading, setBookingsLoading] = useState(true);
    const [reviewModalOpen, setReviewModalOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [reviewData, setReviewData] = useState({
        rating: 5,
        comment: ''
    });
    const [submittingReview, setSubmittingReview] = useState(false);
    const [reviewError, setReviewError] = useState(null);
    const [reviewSuccess, setReviewSuccess] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchBookings = async () => {
            if (user) {
                try {
                    const response = await api.get('/bookings');

                    // Разделяем бронирования на активные и историю
                    const active = [];
                    const history = [];

                    response.data.forEach(booking => {
                        const endDate = new Date(booking.endDate);
                        const now = new Date();

                        if (booking.status === 'COMPLETED' || (endDate < now && booking.status !== 'CANCELLED')) {
                            history.push(booking);
                        } else {
                            active.push(booking);
                        }
                    });

                    setActiveBookings(active);
                    setHistoryBookings(history);
                } catch (error) {
                    console.error('Помилка при завантаженні бронювань:', error);
                } finally {
                    setBookingsLoading(false);
                }
            } else {
                setBookingsLoading(false);
            }
        };

        if (!loading) {
            fetchBookings();
        }
    }, [user, loading]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU');
    };

    const translateStatus = (status) => {
        const statusMap = {
            'PENDING': 'Чекає на підтвердження',
            'CONFIRMED': 'Підтверджено',
            'CANCELLED': 'Скасовано',
            'COMPLETED': 'Завершено'
        };

        return statusMap[status] || status;
    };

    const handleReviewClick = (booking) => {
        setSelectedBooking(booking);
        setReviewModalOpen(true);
    };

    const handleReviewChange = (e) => {
        setReviewData({
            ...reviewData,
            comment: e.target.value
        });
    };

    const handleRatingChange = (rating) => {
        setReviewData({
            ...reviewData,
            rating
        });
    };

    const handleReviewSubmit = async () => {
        if (!selectedBooking) return;

        setSubmittingReview(true);
        setReviewError(null);

        try {
            // Надсилаємо відгук на сервер
            await api.post('/reviews', {
                rating: reviewData.rating,
                comment: reviewData.comment,
                carId: selectedBooking.catalogItemId
            });

            // Оновлюємо список бронювань, щоб відзначити, що відгук залишено
            const updatedHistory = historyBookings.map(booking => {
                if (booking.id === selectedBooking.id) {
                    return { ...booking, hasReview: true };
                }
                return booking;
            });

            setHistoryBookings(updatedHistory);
            setReviewSuccess(true);

            // Закриваємо модальне вікно після короткої затримки
            setTimeout(() => {
                setReviewModalOpen(false);
                setReviewSuccess(false);
                setReviewData({ rating: 5, comment: '' });
            }, 2000);

        } catch (error) {
            setReviewError('Помилка при надсиланні відгуку. Будь ласка, спробуйте пізніше.');
            console.error('Помилка при надсиланні відгуку:', error);
        } finally {
            setSubmittingReview(false);
        }
    };

    if (loading) {
        return <Loader text="Завантаження профілю..." />;
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    // Визначення імені користувача з доступних полів
    const displayName = user.name || user.firstName ||
        (user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : '') ||
        'Пользователь';

    return (
        <Container>
            <Title>Профіль користувача</Title>

            <ProfileCard>
                <ProfileInfo>
                    <Label>ім'я:</Label>
                    {displayName}
                </ProfileInfo>
                <ProfileInfo>
                    <Label>Email:</Label>
                    {user.email}
                </ProfileInfo>
                {user.phone && (
                    <ProfileInfo>
                        <Label>Телефон:</Label>
                        {user.phone}
                    </ProfileInfo>
                )}
            </ProfileCard>

            <SectionTitle>Активне бронювання</SectionTitle>

            {bookingsLoading ? (
                <Loader text="Завантаження бронювань..." />
            ) : activeBookings.length > 0 ? (
                activeBookings.map(booking => (
                    <BookingCard key={booking.id}>
                        <BookingInfo>
                            <Label>Автомобіль:</Label>
                            {booking.catalogItem ? booking.catalogItem.title : "Невідомий автомобіль"}
                        </BookingInfo>
                        <BookingInfo>
                            <Label>Період:</Label>
                            {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                        </BookingInfo>
                        <BookingInfo>
                            <Label>Статус:</Label>
                            <StatusBadge status={booking.status}>{translateStatus(booking.status)}</StatusBadge>
                        </BookingInfo>
                        <BookingInfo>
                            <Label>Сума:</Label>
                            {booking.totalPrice} грн
                        </BookingInfo>
                    </BookingCard>
                ))
            ) : (
                <p>У вас немає активних бронювань</p>
            )}

            <SectionTitle>Історія бронювань</SectionTitle>

            {bookingsLoading ? (
                <Loader text="Завантаження історії..." />
            ) : historyBookings.length > 0 ? (
                historyBookings.map(booking => (
                    <BookingCard key={booking.id}>
                        <BookingInfo>
                            <Label>Автомобіль:</Label>
                            {booking.catalogItem ? booking.catalogItem.title : "Невідомий автомобіль"}
                        </BookingInfo>
                        <BookingInfo>
                            <Label>Період:</Label>
                            {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                        </BookingInfo>
                        <BookingInfo>
                            <Label>Статус:</Label>
                            <StatusBadge status={booking.status}>{translateStatus(booking.status)}</StatusBadge>
                        </BookingInfo>
                        <BookingInfo>
                            <Label>Сума:</Label>
                            {booking.totalPrice} грн
                        </BookingInfo>
                        {!booking.hasReview && booking.status !== 'CANCELLED' && (
                            <ButtonContainer>
                                <Button $primary onClick={() => handleReviewClick(booking)}>
                                    Залишити відгук
                                </Button>
                            </ButtonContainer>
                        )}
                        {booking.hasReview && (
                            <BookingInfo>
                                <Label>Відгук:</Label>
                                Залишений
                            </BookingInfo>
                        )}
                    </BookingCard>
                ))
            ) : (
                <p>Ви не маєте історії бронювань</p>
            )}

            <LogoutButton onClick={handleLogout}>
                Вийти із системи
            </LogoutButton>

            {reviewModalOpen && (
                <Modal>
                    <ModalContent>
                        <ModalTitle>Залишити відгук</ModalTitle>

                        {reviewError && <ErrorMessage message={reviewError} />}
                        {reviewSuccess && <ErrorMessage message="Відгук успішно надіслано!" />}

                        <FormGroup>
                            <Label>Ваша оцінка:</Label>
                            <RatingContainer>
                                {[1, 2, 3, 4, 5].map(star => (
                                    <StarButton
                                        key={star}
                                        type="button"
                                        selected={reviewData.rating >= star}
                                        onClick={() => handleRatingChange(star)}
                                        disabled={submittingReview}
                                    >
                                        ★
                                    </StarButton>
                                ))}
                            </RatingContainer>
                        </FormGroup>

                        <FormGroup>
                            <Label>Ваш відгук:</Label>
                            <TextArea
                                value={reviewData.comment}
                                onChange={handleReviewChange}
                                placeholder="Поділіться своїми враженнями..."
                                disabled={submittingReview}
                            />
                        </FormGroup>

                        <ModalButtonContainer>
                            <Button
                                onClick={() => setReviewModalOpen(false)}
                                disabled={submittingReview}
                            >
                                Отмена
                            </Button>
                            <Button
                                $primary
                                onClick={handleReviewSubmit}
                                disabled={submittingReview}
                            >
                                {submittingReview ? "Відправка..." : "Відправити"}
                            </Button>
                        </ModalButtonContainer>
                    </ModalContent>
                </Modal>
            )}
        </Container>
    );
};

export default ProfilePage;