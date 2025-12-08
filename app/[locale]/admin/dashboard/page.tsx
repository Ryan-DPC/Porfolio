'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface DashboardStats {
    projects: number;
    skills: number;
    blogPosts: number;
    files: number;
}

export default function AdminDashboardPage() {
    const t = useTranslations('admin.dashboard');
    const tNav = useTranslations('nav');
    const router = useRouter();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/admin/dashboard')
            .then((res) => {
                if (!res.ok) {
                    router.push('/fr/admin/login');
                    return;
                }
                return res.json();
            })
            .then((data) => {
                if (data) {
                    setStats(data.stats);
                }
                setLoading(false);
            })
            .catch(() => {
                router.push('/fr/admin/login');
            });
    }, [router]);

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/fr/admin/login');
        router.refresh();
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="skeleton h-12 w-64"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-dark-bg via-dark-surface to-dark-bg dark:from-light-bg dark:via-light-surface dark:to-light-bg">
            <div className="container-custom section-padding">
                <div className="flex justify-between items-center mb-8">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl font-bold gradient-text"
                    >
                        {t('title')}
                    </motion.h1>
                    <Button variant="outline" onClick={handleLogout}>
                        Déconnexion
                    </Button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {stats && [
                        { label: t('stats.projects'), value: stats.projects, icon: '💼', href: '/fr/admin/projects' },
                        { label: t('stats.skills'), value: stats.skills, icon: '🚀', href: '/fr/admin/skills' },
                        { label: t('stats.blogPosts'), value: stats.blogPosts, icon: '📝', href: '/fr/admin/blog' },
                        { label: t('stats.files'), value: stats.files, icon: '📁', href: '/fr/admin/files' },
                    ].map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            onClick={() => router.push(stat.href)}
                        >
                            <Card hover className="text-center cursor-pointer">
                                <div className="text-4xl mb-2">{stat.icon}</div>
                                <div className="text-3xl font-bold text-electric-blue mb-2">
                                    {stat.value}
                                </div>
                                <div className="text-text-dark-secondary dark:text-text-secondary">
                                    {stat.label}
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* Quick Actions */}
                <div>
                    <h2 className="text-2xl font-bold mb-4">Actions rapides</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Button
                            variant="primary"
                            className="w-full"
                            onClick={() => router.push('/fr/admin/projects/new')}
                        >
                            Nouveau Projet
                        </Button>
                        <Button
                            variant="primary"
                            className="w-full"
                            onClick={() => router.push('/fr/admin/blog/new')}
                        >
                            Nouvel Article
                        </Button>
                        <Button
                            variant="primary"
                            className="w-full"
                            onClick={() => router.push('/fr/admin/files')}
                        >
                            Gérer les Fichiers
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
