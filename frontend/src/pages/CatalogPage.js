// src/pages/CatalogPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import catalogService from '../services/catalogService';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';

const Container = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
`;

const Title = styled.h1`
    font-size: 2rem;
    margin-bottom: 1.5rem;
`;

const CategoryTabs = styled.div`
    display: flex;
    margin-bottom: 2rem;
    border-bottom: 1px solid #ddd;
`;

const CategoryTab = styled.button`
    padding: 0.75rem 1.5rem;
    background-color: ${props => props.active ? '#4a6bff' : 'transparent'};
    color: ${props => props.active ? 'white' : '#333'};
    border: none;
    cursor: pointer;
    font-size: 1rem;
    font-weight: ${props => props.active ? 'bold' : 'normal'};

    &:hover {
        background-color: ${props => props.active ? '#4a6bff' : '#f0f0f0'};
    }
`;

const CategorySection = styled.div`
    margin-bottom: 3rem;
`;

const CategoryTitle = styled.h2`
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: #333;
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

const CarTitle = styled.h3`
    font-size: 18px;
    margin-bottom: 8px;
`;

const CarPrice = styled.p`
    font-weight: bold;
    margin-bottom: 12px;
`;

const ButtonContainer = styled.div`
    display: flex;
    gap: 8px;
`;

const Button = styled.button`
    background-color: ${props => props.$primary ? '#4a6bff' : '#333'};
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
        background-color: ${props => props.$primary ? '#3451d1' : '#555'};
    }
`;

const NoCarsMessage = styled.p`
    text-align: center;
    padding: 2rem;
    color: #666;
`;

// Новые стили для функций администратора
const AdminButtons = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-bottom: 1rem;
`;

const AdminButton = styled.button`
    background-color: #4caf50;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    &:hover {
        background-color: #388e3c;
    }
`;

const AdminActionButtons = styled.div`
    display: flex;
    gap: 8px;
    margin-top: 0.5rem;
`;

const EditButton = styled.button`
    background-color: #2196f3;
    color: white;
    border: none;
    padding: 4px 8px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.8rem;

    &:hover {
        background-color: #1976d2;
    }
`;

const DeleteButton = styled.button`
    background-color: #f44336;
    color: white;
    border: none;
    padding: 4px 8px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.8rem;

    &:hover {
        background-color: #d32f2f;
    }
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
    padding: 2rem;
    border-radius: 8px;
    width: 90%;
    max-width: 500px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const FormGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
`;

const Label = styled.label`
    font-weight: bold;
`;

const Input = styled.input`
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
`;

const Textarea = styled.textarea`
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
    min-height: 100px;
    resize: vertical;
`;

const Select = styled.select`
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
`;

const ModalButtons = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 1rem;
`;

const ModalButton = styled.button`
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;

    &.cancel {
        background-color: #f5f5f5;
        color: #333;
    }

    &.submit {
        background-color: #4a6bff;
        color: white;
    }

    &:hover {
        opacity: 0.9;
    }
`;

const CheckboxLabel = styled.label`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
`;

const CATEGORIES = {
    ALL: 'Все',
    ECONOMY: 'Економ',
    COMFORT: 'Комфорт',
    BUSINESS: 'Бізнес',
    ELITE: 'Еліт'
};

const CatalogPage = () => {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeCategory, setActiveCategory] = useState('ALL');

    // Стану для функцій адміністратора
    const [showModal, setShowModal] = useState(false);
    const [editingCar, setEditingCar] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        category: 'ECONOMY',
        imageUrl: '',
        isAvailable: true
    });

    const { user } = useAuth();
    const navigate = useNavigate();

    const isAdmin = user && user.role === 'ADMIN';

    useEffect(() => {
        fetchCars();
    }, []);

    const fetchCars = async () => {
        try {
            setLoading(true);
            const response = await catalogService.getCars();
            setCars(response.data || []);
        } catch (err) {
            setError('Помилка при завантаженні автомобілів');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleBookClick = (car) => {
        if (!user) {
            navigate('/login', {
                state: {
                    message: 'Для бронювання автомобіля необхідно увійти до системи.',
                    redirectAfterLogin: `/car/${car.id}`
                }
            });
            return;
        }

        navigate(`/car/${car.id}`, { state: { openBookingForm: true } });
    };

    // Нові обробники для адміністратора
    const handleAddNewCar = () => {
        setEditingCar(null);
        setFormData({
            title: '',
            description: '',
            price: '',
            category: 'ECONOMY',
            imageUrl: '',
            isAvailable: true
        });
        setShowModal(true);
    };

    const handleEditCar = (car) => {
        console.log('Editing car with ID:', car.id);
        setEditingCar(car);
        setFormData({
            title: car.title || '',
            description: car.description || '',
            price: car.price || '',
            category: car.category || 'ECONOMY',
            imageUrl: car.imageUrl || '',
            isAvailable: car.isAvailable !== false
        });
        setShowModal(true);
    };

    const handleDeleteCar = async (car) => {
        if (window.confirm(`Ви впевнені, що хочете видалити автомобіль "${car.title}"?`)) {
            try {
                await catalogService.deleteCar(car.id);
                // Обновляем список автомобилей после удаления
                fetchCars();
            } catch (err) {
                setError('Помилка при видаленні автомобіля');
                console.error(err);
            }
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Підготовляємо дані для відправки
        const carData = {
            ...formData,
            price: parseFloat(formData.price)
        };

        try {
            if (editingCar) {
                // Оновлення існуючого автомобіля
                await catalogService.updateCar(editingCar.id, carData);
            } else {
                // Створення нового автомобіля
                await catalogService.createCar(carData);
            }

            // Закриваємо модальне вікно та оновлюємо список
            setShowModal(false);
            fetchCars();
        } catch (err) {
            setError('Помилка при збереженні автомобіля');
            console.error(err);
        }
    };

    // Рендерим картку автомобіля
    const renderCarCard = (car) => (
        <CarCard key={car.id}>
            <CarImage>
                {car.imageUrl ?
                    <img src={car.imageUrl} alt={car.title} style={{ maxWidth: '100%', maxHeight: '100%' }} /> :
                    <span>Фото автомобіля</span>
                }
            </CarImage>
            <CarTitle>{car.title}</CarTitle>
            <CarPrice>{car.price} грн/доба</CarPrice>
            <ButtonContainer>
                <Button $primary onClick={() => handleBookClick(car)}>
                    Забронювати
                </Button>
                <Button onClick={() => navigate(`/car/${car.id}`)}>
                    Деталі
                </Button>
            </ButtonContainer>

            {isAdmin && (
                <AdminActionButtons>
                    <EditButton onClick={() => handleEditCar(car)}>
                        Редагувати
                    </EditButton>
                    <DeleteButton onClick={() => handleDeleteCar(car)}>
                        Видалити
                    </DeleteButton>
                </AdminActionButtons>
            )}
        </CarCard>
    );

    if (loading) {
        return <Loader text="Завантаження автомобілів..." />;
    }

    if (error) {
        return (
            <Container>
                <ErrorMessage message={error} />
            </Container>
        );
    }

    // Використовуємо мокові дані, якщо з API нічого не прийшло
    const mockCars = [
        { id: '1', title: 'Kia Rio', price: 1300, category: 'ECONOMY' },
        { id: '2', title: 'Hyundai Solaris', price: 1400, category: 'ECONOMY' },
        { id: '3', title: 'Skoda Octavia', price: 1900, category: 'COMFORT' },
        { id: '4', title: 'Toyota Camry', price: 2300, category: 'COMFORT' },
        { id: '5', title: 'BMW 5 Series', price: 3500, category: 'BUSINESS' },
        { id: '6', title: 'Mercedes E-Class', price: 3800, category: 'BUSINESS' },
        { id: '7', title: 'Mercedes S-Class', price: 6000, category: 'ELITE' },
        { id: '8', title: 'BMW 7 Series', price: 5800, category: 'ELITE' }
    ];

    const displayCars = cars.length > 0 ? cars : mockCars;

    // Фільтруємо автомобілі за категорією
    const filteredCars = activeCategory === 'ALL'
        ? displayCars
        : displayCars.filter(car => car.category === activeCategory);

    // Групуємо автомобілі за категоріями для відображення секціями
    const carsByCategory = displayCars.reduce((acc, car) => {
        if (!acc[car.category]) {
            acc[car.category] = [];
        }
        acc[car.category].push(car);
        return acc;
    }, {});

    // Визначаємо категорії для відображення
    const categoriesToShow = activeCategory === 'ALL'
        ? Object.keys(carsByCategory)
        : [activeCategory];

    return (
        <Container>
            <Title>Каталог автомобілей</Title>

            {isAdmin && (
                <AdminButtons>
                    <AdminButton onClick={handleAddNewCar}>
                        + Додати автомобіль
                    </AdminButton>
                </AdminButtons>
            )}

            <CategoryTabs>
                {Object.entries(CATEGORIES).map(([key, label]) => (
                    <CategoryTab
                        key={key}
                        active={activeCategory === key}
                        onClick={() => setActiveCategory(key)}
                    >
                        {label}
                    </CategoryTab>
                ))}
            </CategoryTabs>

            {activeCategory === 'ALL' ? (
                // Відображення за категоріями, якщо вибрано "Всі"
                categoriesToShow.map(category => (
                    <CategorySection key={category}>
                        <CategoryTitle>
                            {CATEGORIES[category] || category}
                        </CategoryTitle>
                        <CarGrid>
                            {carsByCategory[category].map(car => renderCarCard(car))}
                        </CarGrid>
                    </CategorySection>
                ))
            ) : (
                // Простий список, якщо вибрано конкретну категорію
                <CarGrid>
                    {filteredCars.length > 0 ? (
                        filteredCars.map(car => renderCarCard(car))
                    ) : (
                        <NoCarsMessage>У цій категорії немає автомобілів</NoCarsMessage>
                    )}
                </CarGrid>
            )}

            {/* Модальне вікно для додавання/редагування автомобіля */}
            {showModal && (
                <Modal>
                    <ModalContent>
                        <Title>{editingCar ? 'Редагування автомобіля' : 'Додавання нового автомобіля'}</Title>
                        <Form onSubmit={handleSubmit}>
                            <FormGroup>
                                <Label htmlFor="title">Назва</Label>
                                <Input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    required
                                />
                            </FormGroup>

                            <FormGroup>
                                <Label htmlFor="description">Опис</Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                />
                            </FormGroup>

                            <FormGroup>
                                <Label htmlFor="price">Ціна (грн/доба)</Label>
                                <Input
                                    type="number"
                                    id="price"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    min="0"
                                    step="0.01"
                                    required
                                />
                            </FormGroup>

                            <FormGroup>
                                <Label htmlFor="category">Категорія</Label>
                                <Select
                                    id="category"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="ECONOMY">Економ</option>
                                    <option value="COMFORT">Комфорт</option>
                                    <option value="BUSINESS">Бізнес</option>
                                    <option value="ELITE">Еліт</option>
                                </Select>
                            </FormGroup>

                            <FormGroup>
                                <Label htmlFor="imageUrl">URL зображення</Label>
                                <Input
                                    type="text"
                                    id="imageUrl"
                                    name="imageUrl"
                                    value={formData.imageUrl}
                                    onChange={handleInputChange}
                                    placeholder="https://example.com/car-image.jpg"
                                />
                            </FormGroup>

                            <FormGroup>
                                <CheckboxLabel>
                                    <Input
                                        type="checkbox"
                                        name="isAvailable"
                                        checked={formData.isAvailable}
                                        onChange={handleInputChange}
                                    />
                                    Доступний для бронювання
                                </CheckboxLabel>
                            </FormGroup>

                            <ModalButtons>
                                <ModalButton
                                    type="button"
                                    className="cancel"
                                    onClick={() => setShowModal(false)}
                                >
                                    Відміна
                                </ModalButton>
                                <ModalButton
                                    type="submit"
                                    className="submit"
                                >
                                    {editingCar ? 'Зберегти' : 'Додати'}
                                </ModalButton>
                            </ModalButtons>
                        </Form>
                    </ModalContent>
                </Modal>
            )}
        </Container>
    );
};

export default CatalogPage;