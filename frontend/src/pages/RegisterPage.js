// src/pages/RegisterPage.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';

const Container = styled.div`
    max-width: 500px;
    margin: 2rem auto;
    padding: 2rem;
    border: 1px solid #ddd;
    border-radius: 8px;
    background-color: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
    font-size: 1.5rem;
    text-align: center;
    margin-bottom: 1.5rem;
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
`;

const FormGroup = styled.div`
    margin-bottom: 1rem;
`;

const Label = styled.label`
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
`;

const Input = styled.input`
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
`;

const Button = styled.button`
    width: 100%;
    padding: 0.75rem;
    background-color: #4a6bff;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;

    &:hover {
        background-color: #3451d1;
    }

    &:disabled {
        background-color: #cccccc;
        cursor: not-allowed;
    }
`;

const ErrorMessage = styled.div`
    color: #d32f2f;
    background-color: #ffebee;
    padding: 0.75rem;
    margin-bottom: 1rem;
    border-radius: 4px;
`;

const LinkContainer = styled.div`
    text-align: center;
    margin-top: 1rem;
`;

const StyledLink = styled(Link)`
    color: #4a6bff;
    text-decoration: none;

    &:hover {
        text-decoration: underline;
    }
`;

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        patronymic: '',
        phone: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            setError('Паролі не збігаються');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Важлива зміна: перетворимо дані форми для відповідності очікуванням бекенду
            const { confirmPassword, firstName, lastName, patronymic, ...otherData } = formData;

            // Комбінуємо ім'я, прізвище та по батькові в одне поле name
            const name = `${firstName} ${lastName}${patronymic ? ' ' + patronymic : ''}`.trim();

            //Надсилаємо дані на сервер
            await register({
                ...otherData,
                name // Додаємо поле name, яке чекає на бекенд
            });

            // Після успішної реєстрації перенаправляємо на сторінку входу
            navigate('/login', {
                state: { message: 'Реєстрація успішна! Тепер ви можете увійти до системи.' }
            });
        } catch (err) {
            setError(err.response?.data?.message || 'Помилка під час реєстрації. Будь ласка, спробуйте пізніше.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container>
            <Title>Реєстрація</Title>

            {error && <ErrorMessage>{error}</ErrorMessage>}

            <Form onSubmit={handleSubmit}>
                <FormGroup>
                    <Label htmlFor="firstName">Ім'я</Label>
                    <Input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        disabled={loading}
                        required
                    />
                </FormGroup>

                <FormGroup>
                    <Label htmlFor="lastName">Прізвище</Label>
                    <Input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        disabled={loading}
                        required
                    />
                </FormGroup>

                <FormGroup>
                    <Label htmlFor="patronymic">По-батькові</Label>
                    <Input
                        type="text"
                        id="patronymic"
                        name="patronymic"
                        value={formData.patronymic}
                        onChange={handleChange}
                        disabled={loading}
                    />
                </FormGroup>

                <FormGroup>
                    <Label htmlFor="phone">Телефон</Label>
                    <Input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        disabled={loading}
                        required
                    />
                </FormGroup>

                <FormGroup>
                    <Label htmlFor="email">Email</Label>
                    <Input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={loading}
                        required
                    />
                </FormGroup>

                <FormGroup>
                    <Label htmlFor="password">Пароль</Label>
                    <Input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        disabled={loading}
                        required
                        minLength="6"
                    />
                </FormGroup>

                <FormGroup>
                    <Label htmlFor="confirmPassword">Підтвердження пароля</Label>
                    <Input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        disabled={loading}
                        required
                        minLength="6"
                    />
                </FormGroup>

                <Button type="submit" disabled={loading}>
                    {loading ? <Loader size="small" /> : 'Зареєструватись'}
                </Button>
            </Form>

            <LinkContainer>
                <p>Вже є акаунт? <StyledLink to="/login">Увійти</StyledLink></p>
            </LinkContainer>
        </Container>
    );
};

export default RegisterPage;