'use client';

import React from 'react';
import { cn } from '@/lib/utils/format';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    hover?: boolean;
}

export function Card({ children, className, hover = false }: CardProps) {
    return (
        <div
            className={cn(
                'rounded-lg border bg-dark-surface dark:bg-light-bg border-dark-border dark:border-light-border p-6',
                hover && 'transition-transform hover:scale-105 hover:shadow-lg cursor-pointer',
                className
            )}
        >
            {children}
        </div>
    );
}
