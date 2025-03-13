"use client";

import React from 'react';

/**
 * Универсальный компонент карточки
 * @param {Object} props - Свойства компонента
 * @param {string} [props.variant='default'] - Вариант карточки (default, car, review)
 * @param {string} [props.className] - Дополнительные CSS классы
 * @param {React.ReactNode} props.children - Содержимое карточки
 */
const Card = ({
                  variant = 'default',
                  className = '',
                  children,
                  ...rest
              }) => {
    // Определяем базовые классы для карточки
    const baseClass = variant === 'car' ? 'car-card' : 'card';

    return (
        <div
            className={'${baseClass} ${className}'}
            {...rest}
        >
            {children}
        </div>
    );
};

export default Card;