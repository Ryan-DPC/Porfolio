'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams, usePathname } from 'next/navigation';
import type { BlogPost } from '@/types';
import { formatDate } from '@/lib/utils/format';
import { Button } from '@/components/ui/Button';

export default function BlogPostPage() {
    const t = useTranslations();
    const params = useParams();
    const pathname = usePathname();
    const locale = pathname?.split('/')[1] || 'fr';
    const slug = params?.slug as string;
    const [post, setPost] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!slug) return;
        fetch(`/api/blog/${slug}`)
            .then((res) => {
                if (!res.ok) throw new Error('Not found');
                return res.json();
            })
            .then((data) => {
                setPost(data);
                setLoading(false);
            })
            .catch(() => {
                setError(true);
                setLoading(false);
            });
    }, [slug]);

    if (loading) {
        return (
            <div className="section-padding">
                <div className="container-custom max-w-3xl">
                    <div className="skeleton h-12 w-3/4 mb-6"></div>
                    <div className="skeleton h-64"></div>
                </div>
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="section-padding">
                <div className="container-custom text-center">
                    <p className="mb-4 text-text-dark-secondary dark:text-text-secondary">
                        {t('blog.notFound')}
                    </p>
                    <Link href={`/${locale}/blog`}>
                        <Button variant="outline">{t('common.back')}</Button>
                    </Link>
                </div>
            </div>
        );
    }

    const title = locale === 'fr' ? post.title_fr : post.title_en;
    const content = locale === 'fr' ? post.content_fr : post.content_en;

    return (
        <article className="section-padding">
            <div className="container-custom max-w-3xl">
                <Link href={`/${locale}/blog`}>
                    <Button variant="ghost" size="sm" className="mb-6">
                        ← {t('common.back')}
                    </Button>
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
                        {title}
                    </h1>
                    {post.publishedAt && (
                        <p className="text-text-dark-secondary dark:text-text-secondary mb-8">
                            {t('blog.publishedOn')} {formatDate(post.publishedAt, locale)}
                        </p>
                    )}
                    {post.coverImage && (
                        <img
                            src={post.coverImage}
                            alt={title}
                            className="w-full rounded-lg mb-8 object-cover max-h-96"
                        />
                    )}
                    <div className="prose prose-invert dark:prose-neutral max-w-none whitespace-pre-wrap leading-relaxed text-lg">
                        {content}
                    </div>
                </motion.div>
            </div>
        </article>
    );
}
