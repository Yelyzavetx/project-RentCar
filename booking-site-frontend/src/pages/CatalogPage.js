import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import catalogService from '../services/catalogService';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const Header = styled.header`
  margin-bottom: 20px;
`;

const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 16px;
`;

const CarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
`;

const CarCard = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const CarImage = styled.div`
  height: 160px;
  background-color: #f0f0f0;
  border-radius: 4px;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CarTitle = styled.h2`
  font-size: 18px;
  margin-bottom: 8px;
`;

const CarPrice = styled.p`
  font-weight: bold;
  margin-bottom: 12px;
`;

const BookButton = styled.button`
  background-color: #4a6bff;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
  
  &:hover {
    background-color: #3451d1;
  }
`;

function CatalogPage() {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCars = async () => {
            try {
                const response = await catalogService.getCars();
                setCars(response.data || []);
            } catch (err) {
                setError('Ошибка при загрузке автомобилей');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCars();
    }, []);

    if (loading) {
        return (
            <Container>
                <p>Загрузка...</p>
            </Container>
        );
    }

    if (error) {
        return (
            <Container>
                <p>Ошибка: {error}</p>
                <p>Это простой MVP для проверки работы инфраструктуры.</p>
                <p>Возможно, бэкенд не запущен или не отвечает.</p>
            </Container>
        );
    }

    // Если данных нет, покажем моковые данные для демонстрации
    const displayCars = cars.length > 0 ? cars : [
        { id: '1', title: 'Тестовый автомобиль 1', price: 1300 },
        { id: '2', title: 'Тестовый автомобиль 2', price: 1500 },
        { id: '3', title: 'Тестовый автомобиль 3', price: 2000 },
    ];

    return (
        <Container>
            <Header>
                <Title>Каталог автомобилей</Title>
            </Header>

            <CarGrid>
                {displayCars.map((car) => (
                    <CarCard key={car.id}>
                        <CarImage>
                            <span>Фото автомобиля</span>
                        </CarImage>
                        <CarTitle>{car.title}</CarTitle>
                        <CarPrice>{car.price} грн/сутки</CarPrice>
                        <BookButton>Забронировать</BookButton>
                    </CarCard>
                ))}
            </CarGrid>
        </Container>
    );
}

export default CatalogPage;