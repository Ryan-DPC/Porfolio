'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { AdminNav } from '@/components/layout/AdminNav';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import type { BlogPost } from '@/types';

export default function AdminBlogPage() {
    const t = useTranslations('admin.blog');
    const tc = useTranslations('common');
    const pathname = usePathname();
    const router = useRouter();
    const locale = pathname?.split('/')[1] || 'fr';
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);

    const load = () => {
        fetch('/api/blog?all=true')
            .then((res) => res.json())
            .then((data) => {
                setPosts(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    };

    useEffect(() => {
        load();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm(tc('confirmDelete'))) return;
        const res = await fetch(`/api/blog/${id}`, { method: 'DELETE' });
        if (res.ok) load();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-dark-bg via-dark-surface to-dark-bg dark:from-light-bg dark:via-light-surface dark:to-light-bg">
            <div className="container-custom section-padding">
                <AdminNav />
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold gradient-text">{t('title')}</h1>
                    <Button onClick={() => router.push(`/${locale}/admin/blog/new`)}>
                        {t('new')}
                    </Button>
                </div>

                {loading ? (
                    <div className="skeleton h-40" />
                ) : posts.length === 0 ? (
                    <p className="text-text-dark-secondary dark:text-text-secondary">{t('empty')}</p>
                ) : (
                    <div className="space-y-4">
                        {posts.map((post) => (
                            <Card key={post.id} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <h3 className="font-bold text-lg">
                                        {locale === 'fr' ? post.title_fr : post.title_en}
                                    </h3>
                                    <p className="text-sm text-text-dark-secondary dark:text-text-secondary">
                                        /{post.slug} · {post.published ? t('published') : t('draft')}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <Link href={`/${locale}/admin/blog/${post.id}`}>
                                        <Button variant="outline" size="sm">{tc('edit')}</Button>
                                    </Link>
                                    <Button variant="danger" size="sm" onClick={() => handleDelete(post.id)}>
                                        {tc('delete')}
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
