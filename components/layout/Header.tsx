'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { useState } from 'react';

export function Header() {
    const t = useTranslations();
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const locale = pathname?.split('/')[1] || 'fr';

    const navItems = [
        { href: `/${locale}`, label: t('nav.home') },
        { href: `/${locale}/projects`, label: t('nav.projects') },
        { href: `/${locale}/skills`, label: t('nav.skills') },
        { href: `/${locale}/blog`, label: t('nav.blog') },
        { href: `/${locale}/files`, label: t('nav.files') },
        { href: `/${locale}/contact`, label: t('nav.contact') },
    ];

    const isActive = (href: string) => {
        if (href === `/${locale}`) {
            return pathname === href;
        }
        return pathname?.startsWith(href);
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b border-dark-border dark:border-light-border bg-dark-bg/95 dark:bg-light-bg/95 backdrop-blur supports-[backdrop-filter]:bg-dark-bg/60 dark:supports-[backdrop-filter]:bg-light-bg/60">
            <nav className="container-custom">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link href={`/${locale}`} className="flex items-center space-x-2">
                        <motion.span
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-xl font-bold gradient-text"
                        >
                            Ryan DPC
                        </motion.span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`text-sm font-medium transition-colors hover:text-electric-blue ${isActive(item.href)
                                        ? 'text-electric-blue'
                                        : 'text-text-dark-secondary dark:text-text-secondary'
                                    }`}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    {/* Theme & Language Switcher */}
                    <div className="hidden md:flex items-center gap-4">
                        <LanguageSwitcher />
                        <ThemeToggle />
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            {mobileMenuOpen ? (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            ) : (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="md:hidden py-4 space-y-4"
                    >
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className={`block py-2 text-sm font-medium ${isActive(item.href)
                                        ? 'text-electric-blue'
                                        : 'text-text-dark-secondary dark:text-text-secondary'
                                    }`}
                            >
                                {item.label}
                            </Link>
                        ))}
                        <div className="flex items-center gap-4 pt-4 border-t border-dark-border dark:border-light-border">
                            <LanguageSwitcher />
                            <ThemeToggle />
                        </div>
                    </motion.div>
                )}
            </nav>
        </header>
    );
}
