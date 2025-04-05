// src/components/SuccessMessage.js
import React from 'react';
import styled from 'styled-components';

const SuccessContainer = styled.div`
  background-color: #e8f5e9;
  color: #388e3c;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  border-left: 4px solid #388e3c;
`;

const SuccessMessage = ({ message }) => {
    return (
        <SuccessContainer>
            <p>{message || 'Операція виконана успішно!'}</p>
        </SuccessContainer>
    );
};

export default SuccessMessage;