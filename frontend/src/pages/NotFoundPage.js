// src/pages/NotFoundPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #4a6bff;
`;

const Subtitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 2rem;
  color: #666;
`;

const StyledLink = styled(Link)`
  display: inline-block;
  background-color: #4a6bff;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: bold;
  
  &:hover {
    background-color: #3451d1;
  }
`;

const NotFoundPage = () => {
    return (
        <Container>
            <Title>404</Title>
            <Subtitle>Сторінку не знайдено.</Subtitle>
            <p>Вибачте, запитувана сторінка не існує.</p>
            <StyledLink to="/">Повернутися на головну</StyledLink>
        </Container>
    );
};

export default NotFoundPage;