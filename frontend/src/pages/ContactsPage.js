// src/pages/ContactsPage.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import api from '../services/api';
import { LoadScript, GoogleMap, Marker } from '@react-google-maps/api';

const Container = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
`;

const Title = styled.h1`
    font-size: 2rem;
    margin-bottom: 2rem;
`;

const ContactsGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
    }
`;

const ContactsInfo = styled.div`
    margin-bottom: 2rem;
`;

const ContactSection = styled.div`
    margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h3`
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
    color: #333;
`;

const ContactItem = styled.div`
    margin-bottom: 0.5rem;
`;

const MapContainer = styled.div`
    height: 400px;
    background-color: #f0f0f0;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const ContactsPage = () => {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const response = await api.get('/contacts');
                setContacts(response.data || []);
            } catch (err) {
                setError('Помилка під час завантаження контактної інформації');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchContacts();
    }, []);

    if (loading) {
        return <Loader text="Завантаження контактів..." />;
    }

    if (error) {
        return (
            <Container>
                <ErrorMessage message={error} />
            </Container>
        );
    }

    // Переконаємося, що contacts є масивом перед угрупованням
    const isValidArray = Array.isArray(contacts);

    // Групуємо контакти за типом лише якщо це масив
    const groupedContacts = isValidArray
        ? contacts.reduce((acc, contact) => {
            if (!acc[contact.type]) {
                acc[contact.type] = [];
            }
            acc[contact.type].push(contact);
            return acc;
        }, {})
        : {};

    // Якщо даних немає або contacts не масив, використовуємо заглушки
    const displayContacts = isValidArray && contacts.length > 0
        ? groupedContacts
        : {
            PHONE: [
                { id: '1', type: 'PHONE', value: '+38 (012) 345 67 89', description: 'Відділ оренди' }
            ],
            EMAIL: [
                { id: '3', type: 'EMAIL', value: 'info@rentcar.com', description: 'Загальні питання' },
                { id: '4', type: 'EMAIL', value: 'support@rentcar.com', description: 'Техпідтримка' }
            ],
            ADDRESS: [
                { id: '5', type: 'ADDRESS', value: 'м. Київ, вул. Воскресенська 12а', description: 'Головний офіс' }
            ],
            SOCIAL: [
                { id: '6', type: 'SOCIAL', value: 'facebook.com/rentcar', description: 'Facebook' },
                { id: '7', type: 'SOCIAL', value: 'instagram.com/rentcar', description: 'Instagram' }
            ]
        };

    // Координаты Факультета компьютерных наук
    const center = {
        lat: 50.4641989,  // Широта
        lng: 30.5201403   // Долгота
    };

    const mapStyles = {
        height: "100%",
        width: "100%"
    };

    const defaultOptions = {
        panControl: true,
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: false,
        clickableIcons: false,
        keyboardShortcuts: false,
        scrollwheel: true,
        disableDoubleClickZoom: false,
        fullscreenControl: false,
        styles: [
            {
                featureType: "poi",
                elementType: "labels",
                stylers: [{ visibility: "off" }]
            }
        ]
    };

    return (
        <Container>
            <Title>Наші контакти</Title>

            <ContactsGrid>
                <ContactsInfo>
                    {displayContacts.PHONE && (
                        <ContactSection>
                            <SectionTitle>Телефон</SectionTitle>
                            {displayContacts.PHONE.map(contact => (
                                <ContactItem key={contact.id}>
                                    <div><strong>{contact.value}</strong></div>
                                    <div>{contact.description}</div>
                                </ContactItem>
                            ))}
                        </ContactSection>
                    )}

                    {displayContacts.EMAIL && (
                        <ContactSection>
                            <SectionTitle>Email</SectionTitle>
                            {displayContacts.EMAIL.map(contact => (
                                <ContactItem key={contact.id}>
                                    <div><strong>{contact.value}</strong></div>
                                    <div>{contact.description}</div>
                                </ContactItem>
                            ))}
                        </ContactSection>
                    )}

                    {displayContacts.ADDRESS && (
                        <ContactSection>
                            <SectionTitle>Адреса</SectionTitle>
                            {displayContacts.ADDRESS.map(contact => (
                                <ContactItem key={contact.id}>
                                    <div><strong>{contact.value}</strong></div>
                                    <div>{contact.description}</div>
                                </ContactItem>
                            ))}
                        </ContactSection>
                    )}

                    {displayContacts.SOCIAL && (
                        <ContactSection>
                            <SectionTitle>Соціальні мережі</SectionTitle>
                            {displayContacts.SOCIAL.map(contact => (
                                <ContactItem key={contact.id}>
                                    <div><strong>{contact.value}</strong></div>
                                    <div>{contact.description}</div>
                                </ContactItem>
                            ))}
                        </ContactSection>
                    )}
                </ContactsInfo>

                <MapContainer>
                    <img src="map2.jpg" width="650" alt="Map"/>
                </MapContainer>
            </ContactsGrid>
        </Container>
    );
};

export default ContactsPage;