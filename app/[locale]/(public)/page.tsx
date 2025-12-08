'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/Button';

export default function HomePage() {
    const t = useTranslations();
    const pathname = usePathname();
    const locale = pathname?.split('/')[1] || 'fr';

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="section-padding bg-gradient-to-b from-dark-bg via-dark-surface to-dark-bg dark:from-light-bg dark:via-light-surface dark:to-light-bg">
                <div className="container-custom">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center max-w-4xl mx-auto"
                    >
                        <h1 className="text-5xl md:text-7xl font-bold mb-6">
                            {t('home.hero.greeting')}{' '}
                            <span className="gradient-text">Ryan De Pina Correia</span>
                        </h1>

                        <p className="text-xl md:text-2xl text-text-dark-secondary dark:text-text-secondary mb-4">
                            {t('home.hero.role')}
                        </p>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-lg md:text-xl text-electric-blue font-medium mb-8 italic"
                        >
                            {t('home.hero.tagline')}
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="flex flex-wrap gap-4 justify-center"
                        >
                            <Link href={`/${locale}/projects`}>
                                <Button size="lg">{t('home.hero.cta')}</Button>
                            </Link>
                            <Link href={`/${locale}/contact`}>
                                <Button size="lg" variant="outline">{t('home.hero.contact')}</Button>
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* About Section */}
            <section className="section-padding">
                <div className="container-custom">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="max-w-3xl mx-auto"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">
                            {t('home.about.title')}
                        </h2>
                        <p className="text-lg text-text-dark-secondary dark:text-text-secondary leading-relaxed">
                            {t('home.about.bio')}
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Quick Links */}
            <section className="section-padding bg-dark-surface dark:bg-light-surface">
                <div className="container-custom">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { title: t('nav.projects'), href: `/${locale}/projects`, icon: '💼' },
                            { title: t('nav.skills'), href: `/${locale}/skills`, icon: '🚀' },
                            { title: t('nav.contact'), href: `/${locale}/contact`, icon: '📧' },
                        ].map((item, index) => (
                            <motion.div
                                key={item.href}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Link href={item.href}>
                                    <div className="glass-effect rounded-lg p-8 text-center hover:scale-105 transition-transform cursor-pointer">
                                        <div className="text-5xl mb-4">{item.icon}</div>
                                        <h3 className="text-xl font-bold">{item.title}</h3>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
