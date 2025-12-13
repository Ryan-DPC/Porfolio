'use client';

import { useTranslations } from 'next-intl';


export function Footer() {
    const t = useTranslations();
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t border-dark-border dark:border-light-border bg-dark-surface dark:bg-light-surface">
            <div className="container-custom py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* About */}
                    <div>
                        <h3 className="text-lg font-bold mb-4">Ryan De Pina Correia</h3>
                        <p className="text-sm text-text-dark-secondary dark:text-text-secondary">
                            {t('home.hero.role')}
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h3 className="text-lg font-bold mb-4">Links</h3>
                        <div className="flex flex-col space-y-2 text-sm text-text-dark-secondary dark:text-text-secondary">
                            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-electric-blue transition-colors">
                                GitHub
                            </a>
                            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-electric-blue transition-colors">
                                LinkedIn
                            </a>
                        </div>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-lg font-bold mb-4">{t('nav.contact')}</h3>
                        <p className="text-sm text-text-dark-secondary dark:text-text-secondary">
                            contact@ryandpc.com
                        </p>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-dark-border dark:border-light-border text-center text-sm text-text-dark-secondary dark:text-text-secondary">
                    <p>
                        © {currentYear} Ryan De Pina Correia. {t('footer.rights')}.
                    </p>
                    <p className="mt-2">
                        {t('footer.madeWith')} ❤️ {t('footer.by')} Ryan DPC
                    </p>
                </div>
            </div>
        </footer>
    );
}
