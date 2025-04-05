// src/components/Loader.js
import React from 'react';
import styled from 'styled-components';

const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
`;

const SpinnerWrapper = styled.div`
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
`;

const Spinner = styled.div`
  position: absolute;
  top: 33px;
  width: 13px;
  height: 13px;
  border-radius: 50%;
  background-color: #4a6bff;
  animation-timing-function: cubic-bezier(0, 1, 1, 0);

  &:nth-child(1) {
    left: 8px;
    animation: spinner1 0.6s infinite;
  }
  &:nth-child(2) {
    left: 8px;
    animation: spinner2 0.6s infinite;
  }
  &:nth-child(3) {
    left: 32px;
    animation: spinner2 0.6s infinite;
  }
  &:nth-child(4) {
    left: 56px;
    animation: spinner3 0.6s infinite;
  }

  @keyframes spinner1 {
    0% {
      transform: scale(0);
    }
    100% {
      transform: scale(1);
    }
  }
  @keyframes spinner2 {
    0% {
      transform: translate(0, 0);
    }
    100% {
      transform: translate(24px, 0);
    }
  }
  @keyframes spinner3 {
    0% {
      transform: scale(1);
    }
    100% {
      transform: scale(0);
    }
  }
`;

const LoadingText = styled.p`
  margin-top: 1rem;
  color: #666;
  font-size: 1rem;
`;

const Loader = ({ text = 'Завантаження...' }) => {
    return (
        <LoaderContainer>
            <div>
                <SpinnerWrapper>
                    <Spinner />
                    <Spinner />
                    <Spinner />
                    <Spinner />
                </SpinnerWrapper>
                <LoadingText>{text}</LoadingText>
            </div>
        </LoaderContainer>
    );
};

export default Loader;