'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { AdminNav } from '@/components/layout/AdminNav';

interface DashboardStats {
    projects: number;
    skills: number;
    blogPosts: number;
    files: number;
}

export default function AdminDashboardPage() {
    const t = useTranslations('admin.dashboard');
    const router = useRouter();
    const pathname = usePathname();
    const locale = pathname?.split('/')[1] || 'fr';
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/admin/dashboard')
            .then((res) => {
                if (!res.ok) {
                    router.push(`/${locale}/admin/login`);
                    return;
                }
                return res.json();
            })
            .then((data) => {
                if (data) setStats(data.stats);
                setLoading(false);
            })
            .catch(() => {
                router.push(`/${locale}/admin/login`);
            });
    }, [router, locale]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="skeleton h-12 w-64"></div>
            </div>
        );
    }

    const statCards = [
        { label: t('stats.projects'), value: stats?.projects ?? 0, href: `/${locale}/admin/projects` },
        { label: t('stats.skills'), value: stats?.skills ?? 0, href: `/${locale}/admin/skills` },
        { label: t('stats.blogPosts'), value: stats?.blogPosts ?? 0, href: `/${locale}/admin/blog` },
        { label: t('stats.files'), value: stats?.files ?? 0, href: `/${locale}/admin/files` },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-dark-bg via-dark-surface to-dark-bg dark:from-light-bg dark:via-light-surface dark:to-light-bg">
            <div className="container-custom section-padding">
                <AdminNav />
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl font-bold gradient-text mb-8"
                >
                    {t('title')}
                </motion.h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {statCards.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            onClick={() => router.push(stat.href)}
                        >
                            <Card hover className="text-center cursor-pointer">
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

                <div>
                    <h2 className="text-2xl font-bold mb-4">{t('quickActions')}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Button
                            variant="primary"
                            className="w-full"
                            onClick={() => router.push(`/${locale}/admin/projects/new`)}
                        >
                            {t('newProject')}
                        </Button>
                        <Button
                            variant="primary"
                            className="w-full"
                            onClick={() => router.push(`/${locale}/admin/blog/new`)}
                        >
                            {t('newPost')}
                        </Button>
                        <Button
                            variant="primary"
                            className="w-full"
                            onClick={() => router.push(`/${locale}/admin/files`)}
                        >
                            {t('manageFiles')}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
