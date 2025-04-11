// src/pages/AboutPage.js
import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 2rem;
`;

const Section = styled.section`
  margin-bottom: 3rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: #333;
`;

const Paragraph = styled.p`
  margin-bottom: 1rem;
  line-height: 1.6;
`;

const AdvantagesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const AdvantageCard = styled.div`
  padding: 1.5rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const AdvantageIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #4a6bff;
`;

const AdvantageTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
`;

const AboutPage = () => {
    return (
        <Container>
            <Title>Про компанію</Title>

            <Section>
                <SectionTitle>Наша історія</SectionTitle>
                <Paragraph>
                    Компанія RentCar заснована у 2025 році з метою надати клієнтам надійний та зручний сервіс оренди автомобілів.
                </Paragraph>
                <Paragraph>
                    Наша місія – зробити процес оренди автомобіля максимально простим, швидким та комфортним для клієнтів.
                    Ми постійно вдосконалюємо наш сервіс, розширюємо автопарк та покращуємо умови оренди.
                </Paragraph>
            </Section>

            <Section>
                <SectionTitle>Чому клієнти обирають нас</SectionTitle>
                <AdvantagesGrid>
                    <AdvantageCard>
                        <AdvantageIcon>🚗</AdvantageIcon>
                        <AdvantageTitle>Сучасний автопарк</AdvantageTitle>
                        <Paragraph>
                            Всі наші автомобілі не старші 3 років і регулярно проходять технічне обслуговування.
                        </Paragraph>
                    </AdvantageCard>

                    <AdvantageCard>
                        <AdvantageIcon>💰</AdvantageIcon>
                        <AdvantageTitle>Прозорі ціни</AdvantageTitle>
                        <Paragraph>
                            Жодних прихованих платежів та додаткових комісій.
                        </Paragraph>
                    </AdvantageCard>

                    <AdvantageCard>
                        <AdvantageIcon>🔒</AdvantageIcon>
                        <AdvantageTitle>Страхування</AdvantageTitle>
                        <Paragraph>
                            Всі автомобілі застраховані за повною програмою КАСКО та ОСАЦВ.
                        </Paragraph>
                    </AdvantageCard>

                    <AdvantageCard>
                        <AdvantageIcon>⚡️</AdvantageIcon>
                        <AdvantageTitle>Швидке оформлення</AdvantageTitle>
                        <Paragraph>
                            Мінімум документів та швидке оформлення оренди.
                        </Paragraph>
                    </AdvantageCard>
                </AdvantagesGrid>
            </Section>

            <Section>
                <SectionTitle>Наш підхід</SectionTitle>
                <Paragraph>
                    Ми впевнені, що оренда автомобіля має бути простою та приємною. Тому ми розробили зручний онлайн-сервіс, де ви можете вибрати відповідний автомобіль, забронювати його та оформити всі необхідні документи без зайвого клопоту.
                </Paragraph>
                <Paragraph>
                    Наша команда професіоналів завжди готова допомогти вам із вибором автомобіля, відповісти на всі питання та забезпечити комфортні умови оренди.
                </Paragraph>
            </Section>
        </Container>
    );
};

export default AboutPage;