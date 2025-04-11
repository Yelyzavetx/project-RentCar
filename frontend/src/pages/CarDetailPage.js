import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styled from 'styled-components';
import Loader from '../components/Loader';
import catalogService from '../services/catalogService';
import ErrorMessage from '../components/ErrorMessage';

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

const FormGroup = styled.div`
    margin-bottom: 1rem;
`;

const Label = styled.label`
    display: block;
    margin-bottom: 0.5rem;
`;

const Input = styled.input`
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
`;

const DatePickerContainer = styled.div`
    margin-top: 1rem;
`;

const DatePickerWrapper = styled.div`
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
    
    @media (max-width: 768px) {
        flex-direction: column;
    }
`;

const DatePickerGroup = styled.div`
    flex: 1;
`;

const ButtonsContainer = styled.div`
    display: flex;
    gap: 1rem;
`;

const ConfirmButton = styled(BookButton)`
    margin-top: 0;
`;

const BookingButton = styled(BookButton)`
    background-color: #28a745;
    margin-top: 0;
    
    &:hover {
        background-color: #218838;
    }
`;

const TotalPrice = styled.div`
    font-size: 1.2rem;
    font-weight: bold;
    margin: 1rem 0;
    color: #28a745;
`;

const CarDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [car, setCar] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [datesAvailable, setDatesAvailable] = useState(null);
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        const fetchCarDetails = async () => {
            try {
                setLoading(true);
                const response = await catalogService.getCarById(id);
                setCar(response.data);
            } catch (err) {
                setError('Помилка при завантаженні даних автомобіля');
                console.error('Error fetching car details:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchCarDetails();
    }, [id]);

    useEffect(() => {
        if (startDate && endDate && car?.price) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
            setTotalPrice(days * car.price);
        } else {
            setTotalPrice(0);
        }
    }, [startDate, endDate, car?.price]);
    const checkDatesAvailability = async () => {
        if (!startDate || !endDate) {
            alert('Будь ласка, оберіть обидві дати');
            return;
        }

        try {
            const response = await catalogService.checkAvailability({
                carId: id,
                startDate,
                endDate
            });

            console.log('Check availability response:', response);

            if (response?.data?.data?.available) {
                setDatesAvailable(true);
                alert('Обрані дати вільні! Натисніть "Забронювати" для підтвердження.');
            } else {
                setDatesAvailable(false);
                alert('Обрані дати вже зайняті. Будь ласка, оберіть інші дати.');
            }
        } catch (error) {
            console.error('Error checking dates:', error);
            setDatesAvailable(false);
            alert('Помилка при перевірці дат. Будь ласка, спробуйте пізніше.');
        }
    };

    const handleBooking = async () => {
        if (!user) {
            alert('Для бронювання необхідно увійти в систему');
            navigate('/login');
            return;
        }

        if (!datesAvailable) {
            alert('Будь ласка, спочатку перевірте доступність дат');
            return;
        }

        try {
            console.log('Sending booking request with ID:', id);
            const response = await catalogService.createBooking({
                carId: id,
                startDate,
                endDate
            });

            alert('Бронювання успішно створено!');
            navigate('/bookings');
        } catch (error) {
            console.error('Error creating booking:', error);
            alert('Помилка при створенні бронювання.');
        }
    };

    if (loading) {
        console.log('Loading car details...');
        return <Loader text="Завантаження даних автомобіля..." />;
    }

    if (error) {
        console.error('Error message displayed:', error);
        return <ErrorMessage message={error} />;
    }

    if (!car) {
        console.error('Car not found');
        return <ErrorMessage message="Автомобіль не знайдено" />;
    }

    console.log('Rendering car details:', car);

    return (
        <Container>
            <CarDetails>
                <ImageContainer>
                    {car.imageUrl ? (
                        <img
                            src={car.imageUrl}
                            alt={car.title || 'Фото автомобіля'}
                            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                        />
                    ) : (
                        <span>Фото автомобіля</span>
                    )}
                </ImageContainer>

                <InfoContainer>
                    <Title>{car.title || 'Название не указано'}</Title>
                    <Price>{car.price ? `${car.price} грн/доба` : 'Цена не указана'}</Price>
                    <Description>
                        {car.description || 'Описание не указано'}
                    </Description>
                    <BookingForm>
                        <h2>Форма бронювання</h2>
                        <DatePickerContainer>
                            <DatePickerWrapper>
                                <DatePickerGroup>
                                    <Label>Дата початку:</Label>
                                    <Input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => {
                                            setStartDate(e.target.value);
                                            setDatesAvailable(null);
                                        }}
                                        min={new Date().toISOString().split('T')[0]}
                                    />
                                </DatePickerGroup>
                                <DatePickerGroup>
                                    <Label>Дата завершення:</Label>
                                    <Input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => {
                                            setEndDate(e.target.value);
                                            setDatesAvailable(null);
                                        }}
                                        min={startDate || new Date().toISOString().split('T')[0]}
                                    />
                                </DatePickerGroup>
                            </DatePickerWrapper>
                            {totalPrice > 0 && (
                                <TotalPrice>
                                    Загальна вартість: {totalPrice} грн
                                </TotalPrice>
                            )}
                            <ButtonsContainer>
                                <ConfirmButton onClick={checkDatesAvailability}>
                                    Підтвердити
                                </ConfirmButton>
                                {datesAvailable && (
                                    <BookingButton onClick={handleBooking}>
                                        Забронювати
                                    </BookingButton>
                                )}
                            </ButtonsContainer>
                        </DatePickerContainer>
                    </BookingForm>
                </InfoContainer>
            </CarDetails>
        </Container>
    );
};

export default CarDetailPage;