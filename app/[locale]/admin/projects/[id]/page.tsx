'use client';

import { useEffect, useState } from 'react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { AdminNav } from '@/components/layout/AdminNav';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';

type FormState = {
    title_fr: string;
    title_en: string;
    description_fr: string;
    description_en: string;
    imageUrl: string;
    technologies: string;
    githubUrl: string;
    liveUrl: string;
    startDate: string;
    endDate: string;
    featured: boolean;
    order: number;
};

const emptyForm: FormState = {
    title_fr: '',
    title_en: '',
    description_fr: '',
    description_en: '',
    imageUrl: '',
    technologies: '',
    githubUrl: '',
    liveUrl: '',
    startDate: '',
    endDate: '',
    featured: false,
    order: 0,
};

export default function AdminProjectFormPage() {
    const t = useTranslations('admin.projects');
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

    useEffect(() => {
        if (isNew) return;
        fetch(`/api/projects/${id}`)
            .then((res) => res.json())
            .then((data) => {
                setForm({
                    title_fr: data.title_fr || '',
                    title_en: data.title_en || '',
                    description_fr: data.description_fr || '',
                    description_en: data.description_en || '',
                    imageUrl: data.imageUrl || '',
                    technologies: (data.technologies || []).join(', '),
                    githubUrl: data.githubUrl || '',
                    liveUrl: data.liveUrl || '',
                    startDate: data.startDate ? data.startDate.slice(0, 10) : '',
                    endDate: data.endDate ? data.endDate.slice(0, 10) : '',
                    featured: !!data.featured,
                    order: data.order ?? 0,
                });
                setLoading(false);
            })
            .catch(() => {
                setError(tc('error'));
                setLoading(false);
            });
    }, [id, isNew, tc]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError('');

        const payload = {
            title_fr: form.title_fr,
            title_en: form.title_en,
            description_fr: form.description_fr,
            description_en: form.description_en,
            imageUrl: form.imageUrl || null,
            technologies: form.technologies
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean),
            githubUrl: form.githubUrl || null,
            liveUrl: form.liveUrl || null,
            startDate: form.startDate,
            endDate: form.endDate || null,
            featured: form.featured,
            order: Number(form.order) || 0,
        };

        try {
            const res = await fetch(isNew ? '/api/projects' : `/api/projects/${id}`, {
                method: isNew ? 'POST' : 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error('Save failed');
            router.push(`/${locale}/admin/projects`);
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
                    <Input label={t('titleFr')} value={form.title_fr} onChange={(e) => setForm({ ...form, title_fr: e.target.value })} required />
                    <Input label={t('titleEn')} value={form.title_en} onChange={(e) => setForm({ ...form, title_en: e.target.value })} required />
                    <Textarea label={t('descriptionFr')} value={form.description_fr} onChange={(e) => setForm({ ...form, description_fr: e.target.value })} required />
                    <Textarea label={t('descriptionEn')} value={form.description_en} onChange={(e) => setForm({ ...form, description_en: e.target.value })} required />
                    <Input label={t('technologies')} value={form.technologies} onChange={(e) => setForm({ ...form, technologies: e.target.value })} placeholder="React, Next.js, Prisma" required />
                    <Input label={t('imageUrl')} value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
                    <Input label={t('githubUrl')} value={form.githubUrl} onChange={(e) => setForm({ ...form, githubUrl: e.target.value })} />
                    <Input label={t('liveUrl')} value={form.liveUrl} onChange={(e) => setForm({ ...form, liveUrl: e.target.value })} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input type="date" label={t('startDate')} value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} required />
                        <Input type="date" label={t('endDate')} value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
                    </div>
                    <Input type="number" label={t('order')} value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} />
                    <label className="flex items-center gap-2 text-sm">
                        <input
                            type="checkbox"
                            checked={form.featured}
                            onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                        />
                        {t('featured')}
                    </label>

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <div className="flex gap-3">
                        <Button type="submit" disabled={saving}>
                            {saving ? tc('loading') : tc('save')}
                        </Button>
                        <Button type="button" variant="outline" onClick={() => router.push(`/${locale}/admin/projects`)}>
                            {tc('cancel')}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
