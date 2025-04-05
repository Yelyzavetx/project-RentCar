// src/components/Footer.js
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background-color: #333;
  color: white;
  padding: 2rem 0;
  margin-top: 2rem;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
`;

const FooterSection = styled.div`
  display: flex;
  flex-direction: column;
`;

const FooterTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 1rem;
  color: #fff;
`;

const FooterLink = styled(Link)`
  color: #ddd;
  text-decoration: none;
  margin-bottom: 0.5rem;
  
  &:hover {
    color: #4a6bff;
  }
`;

const ExternalLink = styled.a`
  color: #ddd;
  text-decoration: none;
  margin-bottom: 0.5rem;
  
  &:hover {
    color: #4a6bff;
  }
`;

const FooterBottom = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
  text-align: center;
  border-top: 1px solid #444;
  margin-top: 2rem;
`;

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <FooterContainer>
            <FooterContent>
                <FooterSection>
                    <FooterTitle>RentCar</FooterTitle>
                    <p>Надійний сервіс оренди автомобілів у Києві. Великий вибір автомобілів, вигідні ціни та професійний сервіс.</p>
                </FooterSection>

                <FooterSection>
                    <FooterTitle>Навігація</FooterTitle>
                    <FooterLink to="/">Головна</FooterLink>
                    <FooterLink to="/">Каталог</FooterLink>
                    <FooterLink to="/login">Особистий кабінет</FooterLink>
                </FooterSection>

                <FooterSection>
                    <FooterTitle>Інформація</FooterTitle>
                    <FooterLink to="/about">Про компанію</FooterLink>
                    <FooterLink to="/terms">Умови оренди</FooterLink>
                    <FooterLink to="/faq">Часті питання</FooterLink>
                </FooterSection>

                <FooterSection>
                    <FooterTitle>Контакти</FooterTitle>
                    <p>Телефон: +380123456789</p>
                    <p>Email: rent.car@gmail.com</p>
                    <p>Адреса: м. Київ, вул. Воскресенська 12а</p>
                    <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
                        <ExternalLink href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</ExternalLink>
                        <ExternalLink href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</ExternalLink>
                    </div>
                </FooterSection>
            </FooterContent>

            <FooterBottom>
                <p>&copy; {currentYear} RentCar</p>
            </FooterBottom>
        </FooterContainer>
    );
};

export default Footer;