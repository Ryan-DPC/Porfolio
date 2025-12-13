'use client';

import { useContext } from 'react';
import { ThemeContext } from '@/context/ThemeProvider'; // adapte le chemin selon ton projet

export function useTheme() {
    const context = useContext(ThemeContext);

    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }

    return context;
}
