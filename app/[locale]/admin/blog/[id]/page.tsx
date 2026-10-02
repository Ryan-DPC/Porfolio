'use client';

import { useEffect, useState } from 'react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { AdminNav } from '@/components/layout/AdminNav';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { slugify } from '@/lib/utils/format';

type FormState = {
    slug: string;
    title_fr: string;
    title_en: string;
    content_fr: string;
    content_en: string;
    excerpt_fr: string;
    excerpt_en: string;
    coverImage: string;
    published: boolean;
};

const emptyForm: FormState = {
    slug: '',
    title_fr: '',
    title_en: '',
    content_fr: '',
    content_en: '',
    excerpt_fr: '',
    excerpt_en: '',
    coverImage: '',
    published: false,
};

export default function AdminBlogFormPage() {
    const t = useTranslations('admin.blog');
    const tc = useTranslations('common');
    const pathname = usePathname();
    const router = useRouter();
    const params = useParams();
    const locale = pathname?.split('/')[1] || 'fr';
    const id = params?.id as string | undefined;
    const isNew = !id || id === 'new';

    const [form, setForm] = useState<FormState>(emptyForm);
    const [loading, setLoading] = useState(!isNew);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [autoSlug, setAutoSlug] = useState(true);

    useEffect(() => {
        if (isNew) return;
        fetch(`/api/blog/${id}`)
            .then((res) => res.json())
            .then((data) => {
                setForm({
                    slug: data.slug || '',
                    title_fr: data.title_fr || '',
                    title_en: data.title_en || '',
                    content_fr: data.content_fr || '',
                    content_en: data.content_en || '',
                    excerpt_fr: data.excerpt_fr || '',
                    excerpt_en: data.excerpt_en || '',
                    coverImage: data.coverImage || '',
                    published: !!data.published,
                });
                setAutoSlug(false);
                setLoading(false);
            })
            .catch(() => {
                setError(tc('error'));
                setLoading(false);
            });
    }, [id, isNew, tc]);

    const handleTitleFrChange = (value: string) => {
        setForm((prev) => ({
            ...prev,
            title_fr: value,
            slug: autoSlug ? slugify(value) : prev.slug,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError('');

        const payload = {
            ...form,
            coverImage: form.coverImage || null,
            excerpt_fr: form.excerpt_fr || null,
            excerpt_en: form.excerpt_en || null,
        };

        try {
            const res = await fetch(isNew ? '/api/blog' : `/api/blog/${id}`, {
                method: isNew ? 'POST' : 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error('Save failed');
            router.push(`/${locale}/admin/blog`);
            router.refresh();
        } catch {
            setError(tc('error'));
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="skeleton h-12 w-64" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-dark-bg via-dark-surface to-dark-bg dark:from-light-bg dark:via-light-surface dark:to-light-bg">
            <div className="container-custom section-padding max-w-3xl">
                <AdminNav />
                <h1 className="text-3xl font-bold gradient-text mb-8">
                    {isNew ? t('new') : t('edit')}
                </h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input label={t('titleFr')} value={form.title_fr} onChange={(e) => handleTitleFrChange(e.target.value)} required />
                    <Input label={t('titleEn')} value={form.title_en} onChange={(e) => setForm({ ...form, title_en: e.target.value })} required />
                    <Input
                        label={t('slug')}
                        value={form.slug}
                        onChange={(e) => {
                            setAutoSlug(false);
                            setForm({ ...form, slug: e.target.value });
                        }}
                        required
                    />
                    <Textarea label={t('excerptFr')} value={form.excerpt_fr} onChange={(e) => setForm({ ...form, excerpt_fr: e.target.value })} />
                    <Textarea label={t('excerptEn')} value={form.excerpt_en} onChange={(e) => setForm({ ...form, excerpt_en: e.target.value })} />
                    <Textarea label={t('contentFr')} value={form.content_fr} onChange={(e) => setForm({ ...form, content_fr: e.target.value })} required className="min-h-[200px]" />
                    <Textarea label={t('contentEn')} value={form.content_en} onChange={(e) => setForm({ ...form, content_en: e.target.value })} required className="min-h-[200px]" />
                    <Input label={t('coverImage')} value={form.coverImage} onChange={(e) => setForm({ ...form, coverImage: e.target.value })} />
                    <label className="flex items-center gap-2 text-sm">
                        <input
                            type="checkbox"
                            checked={form.published}
                            onChange={(e) => setForm({ ...form, published: e.target.checked })}
                        />
                        {t('published')}
                    </label>

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <div className="flex gap-3">
                        <Button type="submit" disabled={saving}>
                            {saving ? tc('loading') : tc('save')}
                        </Button>
                        <Button type="button" variant="outline" onClick={() => router.push(`/${locale}/admin/blog`)}>
                            {tc('cancel')}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
