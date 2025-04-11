// src/pages/LoginPage.js
import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import ErrorMessage from '../components/ErrorMessage';

const Container = styled.div`
    max-width: 480px;
    margin: 2rem auto;
    padding: 2rem;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
    font-size: 1.8rem;
    margin-bottom: 1.5rem;
    text-align: center;
    color: #333;
`;

const LoginForm = styled.form`
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

    &:focus {
        outline: none;
        border-color: #4a6bff;
    }
`;

const Button = styled.button`
    background-color: #4a6bff;
    color: white;
    padding: 0.75rem;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
    margin-top: 1rem;

    &:hover {
        background-color: #3451d1;
    }

    &:disabled {
        background-color: #b3b3b3;
        cursor: not-allowed;
    }
`;

const RegisterLink = styled.div`
    margin-top: 1.5rem;
    text-align: center;
    font-size: 0.9rem;
`;

const StyledLink = styled(Link)`
    color: #4a6bff;
    text-decoration: none;

    &:hover {
        text-decoration: underline;
    }
`;

const LoginPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [credentials, setCredentials] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Перевіряємо, чи є повідомлення та перенаправлення в state
    const message = location.state?.message;
    const redirectPath = location.state?.redirectAfterLogin || '/';

    const handleChange = (e) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await login(credentials);
            navigate(redirectPath);
        } catch (err) {
            setError(err.response?.data?.message || 'Помилка входу. Перевірте email та пароль.');
            console.error('Помилка входу:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container>
            <Title>Вхід у систему</Title>

            {message && <ErrorMessage message={message} />}
            {error && <ErrorMessage message={error} />}

            <LoginForm onSubmit={handleSubmit}>
                <FormGroup>
                    <Label htmlFor="email">Email</Label>
                    <Input
                        type="email"
                        id="email"
                        name="email"
                        value={credentials.email}
                        onChange={handleChange}
                        required
                    />
                </FormGroup>

                <FormGroup>
                    <Label htmlFor="password">Пароль</Label>
                    <Input
                        type="password"
                        id="password"
                        name="password"
                        value={credentials.password}
                        onChange={handleChange}
                        required
                    />
                </FormGroup>

                <Button type="submit" disabled={loading}>
                    {loading ? 'Вхід...' : 'Увійти'}
                </Button>
            </LoginForm>

            <RegisterLink>
                Немає облікового запису? <StyledLink to="/register">Зареєструйтесь</StyledLink>
            </RegisterLink>
        </Container>
    );
};

export default LoginPage;