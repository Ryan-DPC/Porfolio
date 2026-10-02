'use client';

import React from 'react';
import { cn } from '@/lib/utils/format';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
}

export function Textarea({
    label,
    error,
    className,
    id,
    ...props
}: TextareaProps) {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
        <div className="w-full">
            {label && (
                <label
                    htmlFor={textareaId}
                    className="block text-sm font-medium text-text-dark-primary dark:text-text-primary mb-1"
                >
                    {label}
                </label>
            )}
            <textarea
                id={textareaId}
                className={cn(
                    'w-full px-4 py-2 rounded-md border bg-dark-surface dark:bg-light-bg text-text-dark-primary dark:text-text-primary',
                    'border-dark-border dark:border-light-border min-h-[120px] resize-y',
                    'focus:outline-none focus:ring-2 focus:ring-electric-blue',
                    error && 'border-red-500',
                    className
                )}
                {...props}
            />
            {error && (
                <p className="mt-1 text-sm text-red-500">{error}</p>
            )}
        </div>
    );
}
