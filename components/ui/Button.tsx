'use client';

import React from 'react';
import { cn } from '@/lib/utils/format';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    children: React.ReactNode;
}

export function Button({
    variant = 'primary',
    size = 'md',
    className,
    children,
    disabled,
    ...props
}: ButtonProps) {
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue disabled:opacity-50 disabled:pointer-events-none';

    const variants = {
        primary: 'bg-electric-blue text-white hover:bg-electric-blue-dark',
        secondary: 'bg-dark-surface dark:bg-light-surface text-text-dark-primary dark:text-text-primary hover:opacity-90',
        outline: 'border-2 border-electric-blue text-electric-blue hover:bg-electric-blue hover:text-white',
        ghost: 'hover:bg-dark-surface dark:hover:bg-light-surface text-text-dark-primary dark:text-text-primary',
        danger: 'bg-red-600 text-white hover:bg-red-700',
    };

    const sizes = {
        sm: 'text-sm px-3 py-1.5',
        md: 'text-base px-4 py-2',
        lg: 'text-lg px-6 py-3',
    };

    return (
        <button
            className={cn(baseStyles, variants[variant], sizes[size], className)}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    );
}
