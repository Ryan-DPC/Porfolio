'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import type { BlogPost } from '@/types';
import { formatDate, truncate } from '@/lib/utils/format';
import { Card } from '@/components/ui/Card';

export default function BlogPage() {
    const t = useTranslations();
    const pathname = usePathname();
    const locale = pathname?.split('/')[1] || 'fr';
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/blog')
            .then((res) => res.json())
            .then((data) => {
                setPosts(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="section-padding">
                <div className="container-custom">
                    <div className="skeleton h-12 w-64 mx-auto mb-8"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[1, 2].map((i) => (
                            <div key={i} className="skeleton h-48"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="section-padding">
            <div className="container-custom">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
                        {t('blog.title')}
                    </h1>
                </motion.div>

                {posts.length === 0 ? (
                    <p className="text-center text-text-dark-secondary dark:text-text-secondary">
                        {t('blog.noPosts')}
                    </p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {posts.map((post, index) => {
                            const title = locale === 'fr' ? post.title_fr : post.title_en;
                            const excerpt =
                                locale === 'fr'
                                    ? post.excerpt_fr || truncate(post.content_fr, 160)
                                    : post.excerpt_en || truncate(post.content_en, 160);

                            return (
                                <motion.div
                                    key={post.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Link href={`/${locale}/blog/${post.slug}`}>
                                        <Card hover className="h-full">
                                            {post.coverImage && (
                                                <img
                                                    src={post.coverImage}
                                                    alt={title}
                                                    className="w-full h-40 object-cover rounded-md mb-4"
                                                />
                                            )}
                                            <h2 className="text-xl font-bold mb-2">{title}</h2>
                                            <p className="text-text-dark-secondary dark:text-text-secondary mb-4">
                                                {excerpt}
                                            </p>
                                            {post.publishedAt && (
                                                <p className="text-sm text-electric-blue">
                                                    {t('blog.publishedOn')}{' '}
                                                    {formatDate(post.publishedAt, locale)}
                                                </p>
                                            )}
                                            <span className="inline-block mt-3 text-sm text-electric-blue">
                                                {t('blog.readMore')} →
                                            </span>
                                        </Card>
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
