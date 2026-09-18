'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/Button';

const links = [
    { path: 'dashboard', label: 'Dashboard' },
    { path: 'projects', label: 'Projets' },
    { path: 'skills', label: 'Compétences' },
    { path: 'blog', label: 'Blog' },
    { path: 'files', label: 'Fichiers' },
];

export function AdminNav() {
    const pathname = usePathname();
    const locale = pathname?.split('/')[1] || 'fr';

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        window.location.href = `/${locale}/admin/login`;
    };

    return (
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-dark-border dark:border-light-border">
            <nav className="flex flex-wrap gap-2">
                {links.map((link) => {
                    const href = `/${locale}/admin/${link.path}`;
                    const active = pathname?.includes(`/admin/${link.path}`);
                    return (
                        <Link
                            key={link.path}
                            href={href}
                            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                                active
                                    ? 'bg-electric-blue text-white'
                                    : 'text-text-dark-secondary dark:text-text-secondary hover:text-electric-blue'
                            }`}
                        >
                            {link.label}
                        </Link>
                    );
                })}
            </nav>
            <Button variant="outline" size="sm" onClick={handleLogout}>
                Déconnexion
            </Button>
        </div>
    );
}
