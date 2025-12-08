import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { ThemeProvider } from '@/hooks/useThemeHook';
import '@/app/globals.css';

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
    display: 'swap',
});

export const metadata: Metadata = {
    title: 'Ryan De Pina Correia - Portfolio',
    description: 'Étudiant à l\'ETML en développement. Qualité dans l\'exécution — réflexion avant action.',
    keywords: ['développeur', 'portfolio', 'web', 'ETML', 'étudiant'],
    authors: [{ name: 'Ryan De Pina Correia' }],
    openGraph: {
        title: 'Ryan De Pina Correia - Portfolio',
        description: 'Étudiant à l\'ETML en développement',
        type: 'website',
    },
};

export default async function RootLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const messages = await getMessages();

    return (
        <html lang={locale} suppressHydrationWarning>
            <body className={inter.className}>
                <NextIntlClientProvider messages={messages}>
                    <ThemeProvider>
                        {children}
                    </ThemeProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
