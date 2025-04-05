// src/components/ErrorMessage.js
import React from 'react';
import styled from 'styled-components';

const ErrorContainer = styled.div`
  background-color: #ffebee;
  color: #d32f2f;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  border-left: 4px solid #d32f2f;
`;

const ErrorMessage = ({ message }) => {
    return (
        <ErrorContainer>
            <p>{message || 'Відбулася помилка. Будь ласка, спробуйте знову.'}</p>
        </ErrorContainer>
    );
};

export default ErrorMessage;