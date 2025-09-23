import React, { ReactNode } from 'react';

// Fix: Updated CardProps to accept standard HTML attributes like onClick, and spread them onto the div.
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
    className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '', ...props }) => {
    return (
        <div className={`bg-white rounded-lg shadow-lg p-4 sm:p-6 ${className}`} {...props}>
            {children}
        </div>
    );
};

export default Card;