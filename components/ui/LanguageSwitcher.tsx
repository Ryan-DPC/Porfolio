'use client';

import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { locales, localeNames, type Locale } from '@/lib/i18n/settings';

export function LanguageSwitcher() {
    const pathname = usePathname();
    const router = useRouter();

    const currentLocale = pathname?.split('/')[1] as Locale;

    const switchLocale = (locale: Locale) => {
        if (!pathname) return;
        const segments = pathname.split('/');
        segments[1] = locale;
        router.push(segments.join('/'));
    };

    return (
        <div className="flex items-center gap-2">
            {locales.map((locale) => (
                <motion.button
                    key={locale}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => switchLocale(locale)}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${currentLocale === locale
                            ? 'bg-electric-blue text-white'
                            : 'text-text-dark-secondary dark:text-text-secondary hover:bg-dark-surface dark:hover:bg-light-surface'
                        }`}
                >
                    {locale.toUpperCase()}
                </motion.button>
            ))}
        </div>
    );
}
