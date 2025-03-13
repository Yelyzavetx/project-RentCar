"use client";

import React from 'react';

const Button = ({
                    variant = 'primary',
                    size = 'md',
                    className = '',
                    fullWidth = false,
                    onClick,
                    children,
                    ...rest
                }) => {
    // Базовые классы для всех кнопок
    const baseClass = 'btn';

    // Классы на основе размера
    const sizeClasses = {
        sm: 'text-sm py-1 px-3',
        md: 'py-2 px-4',
        lg: 'text-lg py-3 px-6'
    };

    // Собираем все классы
    const buttonClass = `
    ${baseClass}
    ${sizeClasses[size] || sizeClasses.md}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `;

    return (
        <button
            className={buttonClass}
            onClick={onClick}
            {...rest}
        >
            <span>{children}</span>
        </button>
    );
};

export default Button;